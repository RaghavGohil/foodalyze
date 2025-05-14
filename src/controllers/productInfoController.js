import { genAI } from "../services/geminiClient.js";
import { supabase } from "../services/supabaseClient.js";
import { marked } from "marked";

const markdownToHTML = (md) => marked.parse(md || "");

export const productInfo = async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const productId = req.query.productId;
  if (!productId) {
    return res.status(400).send("Missing productId in query.");
  }

  try {
    // Step 1: Fetch product
    const { data: product, error: productError } = await supabase
      .from("Product")
      .select("*")
      .eq("barcode", productId)
      .single();

    if (productError || !product) {
      return res.status(404).send("Product not found in database.");
    }

    // Step 2: Convert image to base64
    let base64Image = null;
    if (product.productImage) {
      const hexString = product.productImage.replace(/\\x/g, "");
      const hexBuffer = Buffer.from(hexString, "hex");
      base64Image = `data:image/jpeg;base64,${hexBuffer.toString("base64")}`;
    }
    product.base64Image = base64Image;

    if (product.nutriScore) {
      product.nutriScore = product.nutriScore.toLowerCase();
    }

    // Step 3: Verify user
    if (!req.user || !req.user.id) {
      return res.status(401).send("User not authenticated.");
    }

    const { data: user, error: userError } = await supabase
    .from('User')
    .select(`
      id,
      name,
      phone,
      gender,
      UserInformation (
        id,
        bmi,
        dietaryPref,
        activityLevel,
        healthConditions,
        allergies,
        preferredCuisines,
        avoidedCuisines,
        medications
      )
    `)
    .eq('authUserId', req.user.id)
    .single();

    if (userError || !user) {
      return res.status(404).send("User not found.");
    }

    if (userError || !user) {
      return res.status(404).send("User not found.");
    }
    // Step 4: Gemini AI prompt
    const prompt = `
      You are an AI tool to analyze product data stored in a JSON-like structure.

      User Details: ${JSON.stringify(user.UserInformation || "")}
      Product Name: ${JSON.stringify(product.name || "")}
      Allergens: ${JSON.stringify(product.allergens || "")}
      Ingredients: ${JSON.stringify(product.ingredients || "")}

      Give personal health warnings for the ingredients and suggest healthy alternatives, explain in depth.
      For healthier alternatives, also give healthier related brand names and give alternatives on cuisine.
      Also see consider other user infomation and infer product type from it's name. Nutritional breakdown shows the nutrition you get from the ingredients.

      Give the response in the following format **strictly as JSON with no nesting** all in markdown format,
      data should be pointwise whereever necessary (also add emojis but not too much):
      {
        "summary": "<your_response>",
        "ingredientsToTrust": "<your_response>",
        "ingredientsThatRaiseRedFlags": "<your_response>",
        "healthWarnings": "<your_response>", 
        "alternatives": "<your_response>", 
        "ingredients": "<your_response>", 
        "nutritionBreakdown": "<your_response>"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let raw = await response.text();
    raw = raw.replace(/```json\s*|\s*```/g, "").trim();

    let aiResponse;
    try {
      aiResponse = JSON.parse(raw);
    } catch (jsonErr) {
      console.error("Failed to parse Gemini AI response:", jsonErr.message);
      return res.status(500).send("AI response could not be parsed.");
    }
    aiResponse = {
      summary: markdownToHTML(aiResponse.summary),
      ingredientsToTrust: markdownToHTML(aiResponse.ingredientsToTrust),
      ingredientsThatRaiseRedFlags: markdownToHTML(aiResponse.ingredientsThatRaiseRedFlags),
      healthWarnings: markdownToHTML(aiResponse.healthWarnings),
      alternatives: markdownToHTML(aiResponse.alternatives),
      ingredients: markdownToHTML(aiResponse.ingredients),
      nutritionBreakdown: markdownToHTML(aiResponse.nutritionBreakdown),
    };
    // Step 5: Save search history
    const historyEntry = {
      product,
      aiResponse,
    };

    // ✅ Insert into `SearchHistory` table
    const { error: insertError } = await supabase
      .from("SearchHistory")
      .insert([{ userId: user.id, data: historyEntry, updatedAt:new Date().toISOString()}]);

    if (insertError) {
      console.error("Error inserting into SearchHistory table:", insertError.message);
      // Don't block user just because history logging failed
    }

    // Step 6: Render product info page
    res.render("product_info", {
      product,
      aiResponse,
    });
  } catch (err) {
    console.error("Supabase or Gemini error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};