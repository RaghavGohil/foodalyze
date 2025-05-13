import { supabase } from "../services/supabaseClient.js";

export const getSearchHistory = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("User")
      .select("id")
      .eq("authUserId", req.user.id)
      .single();

    if (error || !user) {
      console.error("Error fetching user:", error?.message);
      return res.status(404).json({ error: "User not found." });
    }

    // Fetch and sort search history by created_at DESC (most recent first)
    const { data: history, error: historyError } = await supabase
      .from("SearchHistory")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (historyError) {
      console.error("Error fetching search history:", historyError);
      return res.status(500).json({ error: "An error occurred while fetching search history." });
    }

    return res.render("search_history", { searchHistory: history });
  } catch (error) {
    console.error("Error retrieving search history:", error.message);
    return res.status(500).json({ error: "An error occurred while fetching search history." });
  }
};

export const deleteSearchHistory = async (req, res) => {
  try {
    // Get the current user's internal ID
    const searchHistoryId = req.query.searchHistoryId;
    const { data: user, error } = await supabase
      .from("User")
      .select("id")
      .eq("authUserId", req.user.id)
      .single();

    if (error || !user) {
      console.error("Error fetching user:", error?.message);
      return res.status(404).json({ error: "User not found." });
    }

    // Delete all history entries for this user
    const { error: deleteError } = await supabase
      .from("SearchHistory")
      .delete()
      .eq("userId", user.id)
      .eq("id", searchHistoryId);

    if (deleteError) {
      console.error("Error deleting search history:", deleteError);
      return res.status(500).json({ error: "Failed to delete search history." });
    }

    return res.redirect('/search-history');
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const productId = req.query.productId; // This could be a barcode or internal ID

    // Fetch AI-generated insights (based on productId or barcode)
    const { data, error} = await supabase
      .from("SearchHistory")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
        throw err;
    }

    return res.render("product_info", {
      product: data.data.product,
      aiResponse: data.data.aiResponse,
    });
  } catch (err) {
    console.error("Error rendering product details:", err.message);
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

