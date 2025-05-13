import { supabase } from "../services/supabaseClient.js";

export const getSearchHistory = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);  // Get user ID from route params

    const { data, error } = await supabase
    .from("User")
    .select("*, SearchHistory(*)")
    .eq("authUserId", req.user.id)
    .single();

    // Handle errors from Supabase
    if (error) {
      console.error('Error fetching search history:', error);
      return res.status(500).json({ error: 'An error occurred while fetching search history.' });
    }

    // If no data found, send a 404 response
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No search history found for this user.' });
    }
    // Return the search history data
    return res.render('search_history',{ searchHistory: data.SearchHistory });
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ error: 'An error occurred while fetching search history.' });
  }
};