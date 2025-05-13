import { supabase } from '../services/supabaseClient.js';

export const isAdmin = async (req, res, next) => {
  try {
    // Retrieve the access token from cookies or headers
    const token = req.cookies['access_token'] || req.headers.authorization?.split(' ')[1];
    if (!token) return res.redirect('/');
    // Fetch the authenticated user using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.redirect('/');
    // Check if the user has the 'admin' role in user_metadata
    if (user.user_metadata?.role === 'admin') {
      req.user = user; // Attach user to the request object
      return next();
    }
    // If not an admin, redirect to homepage
    return res.redirect('/');
  } catch (err) {
    console.error('Admin check error:', err);
    return res.redirect('/');
  }
};

export const checkNormalUser = async (req, res, next) => {
  try {
    // Retrieve the access token from cookies or headers
    const token = req.cookies['access_token'] || req.headers.authorization?.split(' ')[1];
    if (!token) return res.redirect('/');
    // Fetch the authenticated user using the token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.redirect('/');
    // Check if the user has the 'admin' role in user_metadata
    if (user.user_metadata?.role === 'admin') {
      // If not an admin, redirect to homepage
      return res.redirect('/');
    }
    req.user = user; // Attach user to the request object
    return next();
  } catch (err) {
    console.error('Admin check error:', err);
    return res.redirect('/');
  }
};