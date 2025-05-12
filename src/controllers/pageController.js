import { genAI } from "../services/geminiClient.js";
import axios from "axios";

export const productInfo = async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const barcode = req.query.productId;

  if (!barcode) {
    return res.status(400).send("Missing productId in query.");
  }

  try {
    const { data } = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}`
    );
    if (data.status === 0) {
      return res.status(404).send("Product not found.");
    }

    const prompt = `
      You are an AI tool to analyze JSON data.

      The data is:
      ${JSON.stringify(data.product.product_name)}
      ${JSON.stringify(data.product.allergens)}
      ${JSON.stringify(data.product.ingredients)}
      ${JSON.stringify(data.product.ingredients)}
      
      Give personal health warnings for the ingredients and suggest healthy alternatives.

      Give the response in the following format **strictly as JSON** with no markdown or extra text:
      {
        summary : "<your_response>",
        ingredientsToTrust : "<your_response>",
        ingredientsThatRaiseRedFlags : "<your_response>",
        healthWarnings : "<your_response>", 
        alternatives : "<your_response>", 
        ingredients : "<your_response>", 
        nutritionBreakdown : "<your_response>"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let raw = await response.text();

    // 🧼 Clean up possible markdown formatting
    raw = raw.replace(/^```json\s*|\s*```$/g, '').trim();

    let aiResponse = {};
    try {
      aiResponse = JSON.parse(raw);
    } catch (jsonErr) {
      console.error("Failed to parse AI response:", jsonErr.message);
      return res.status(500).send("AI response could not be parsed.");
    }

    res.render("product_info", {
      product: data.product,
      aiResponse: aiResponse
    });

  } catch (err) {
    console.error("Axios or AI error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};
