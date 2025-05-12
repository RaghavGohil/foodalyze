import { genAI } from "../services/geminiClient.js";
import axios from "axios";
import { supabase } from "../services/supabaseClient.js";

export const productInfo = async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const productId = req.query.productId;

  if (!productId) {
    return res.status(400).send("Missing productId in query.");
  }

  try {
    // Fetch product from Supabase by productId
    const { data: product, error } = await supabase
      .from("Product")
      .select("*")
      .eq("barcode", productId)
      .limit(1)
      .single();

    // Convert hex to buffer and then to base64 for each product image
    let base64Image = null;
    if (product.productImage) {
      // Remove '\x' prefix from the hex string and convert it to a buffer
      const hexString = product.productImage.replace(/\\x/g, ""); // Removing the '\x' parts
      const hexBuffer = Buffer.from(hexString, "hex");
      // Convert the buffer to base64
      base64Image = `data:image/jpeg;base64,${hexBuffer.toString("base64")}`;
    }

    product.base64Image = base64Image;
    product.nutriScore = product.nutriScore.toLowerCase();

    if (error || !product) {
      return res.status(404).send("Product not found in database.");
    }

    // Build prompt for AI
    const prompt = `
      You are an AI tool to analyze product data stored in a JSON-like structure.

      Product Name: ${JSON.stringify(product.name || "")}
      Allergens: ${JSON.stringify(product.allergens || "")}
      Ingredients: ${JSON.stringify(product.ingredients || "")}

      Give personal health warnings for the ingredients and suggest healthy alternatives.

      Give the response in the following format **strictly as JSON** with no markdown or extra text:
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

    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;

    let raw = await response.text();

    // Clean up potential formatting
    raw = raw.replace(/```json\s*|\s*```/g, "").trim();

    let aiResponse = {};
    try {
      aiResponse = JSON.parse(raw);
    } catch (jsonErr) {
      console.error("Failed to parse Gemini AI response:", jsonErr.message);
      return res.status(500).send("AI response could not be parsed.");
    }

    // Render with product and AI info
    res.render("product_info", {
      product: product,
      aiResponse: aiResponse,
    });
  } catch (err) {
    console.error("Supabase or Gemini error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};
