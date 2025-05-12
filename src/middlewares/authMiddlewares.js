import { supabase } from '../services/supabaseClient.js';

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies['access_token'];  // Read token from cookie
  if (!token) {
    return res.redirect('/');
  }
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.redirect('/');
  }
  req.user = data.user; // Attach the user to the request
  next(); // Move to the next middleware/controller
};