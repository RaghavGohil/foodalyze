import { supabase } from "../services/supabaseClient.js";
import { prisma } from "../services/prismaClient.js";

export const signup = async (req, res) => {
  const { email, password, name, phone, gender } = req.body;
  try {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    // Log the entire response object to check what we are getting
    console.log("Signup Response:", data);
    console.log("Signup Error:", error);

    if (error) throw error;

    const authUserId = data.user.id;

    // Create user in Prisma database with Supabase user ID and optional fields
    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        gender,
        authUserId,
      },
    });

    // Check if session exists
    const session = data.session;
    if (!session) {
      throw new Error("Session object is missing from signup response");
    }

    // Extract access token if session exists
    const accessToken = session.access_token;
    if (!accessToken) {
      throw new Error("Failed to retrieve access token from session.");
    }

    // Set the access token in a cookie for session management
    res.cookie("access_token", accessToken, {
      httpOnly: true, // To prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
    });

    res.redirect("/dashboard"); // Redirect after successful signup
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Log the response data and error to debug
    console.log("Login Response:", data);
    console.log("Login Error:", error);

    if (error) throw error;

    // Check if session exists
    const session = data.session;
    if (!session) {
      throw new Error("Session object is missing from login response");
    }

    // Extract access token from the session
    const accessToken = session.access_token;
    if (!accessToken) {
      throw new Error("Failed to retrieve access token from session.");
    }

    // Set the access token in a cookie for session management
    res.cookie("access_token", accessToken, {
      httpOnly: true, // Prevent access to token via JavaScript
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // Cookie expires in 1 day
    });

    res.redirect("/dashboard"); // Redirect after successful login
  } catch (err) {
    console.error("Login Error:", err);
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (_req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear the cookie on logout
    res.clearCookie("access_token");
    res.redirect("/");
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(400).json({ error: err.message });
  }
};
