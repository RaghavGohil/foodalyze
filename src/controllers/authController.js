import { supabase } from "../services/supabaseClient.js";

export const signup = async (req, res) => {
  const { email, password, name, phone, gender } = req.body;

  try {
    // Step 1: Create user in Supabase Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) throw new Error(`Auth Error: ${signupError.message}`);

    const user = signupData?.user;
    if (!user) throw new Error("Signup failed — user not returned");

    const authUserId = user.id;

    // Step 2: Insert user details into Supabase Database
    const { error: insertError } = await supabase.from("User").insert([
      {
        name,
        phone,
        gender,
        authUserId: authUserId, // assuming this column exists
        updatedAt: new Date().toISOString()
      },
    ]);

    if (insertError) {
      // Rollback: Delete the Supabase auth user if DB insert fails
      await supabase.auth.admin.deleteUser(authUserId); // Requires service role key!
      throw new Error(`DB Insert Error: ${insertError.message}`);
    }

    // Step 3: Get the session to retrieve access token
    const session = signupData.session;
    if (!session || !session.access_token) {
      throw new Error("Signup succeeded but no session/token received.");
    }

    // Step 4: Set token in cookie
    res.cookie("access_token", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.redirect("/dashboard");
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

    if(email !== process.env.ADMIN_EMAIL)
      res.redirect("/dashboard"); // Redirect after successful login
    else
      res.redirect("/admin"); // Redirect after successful login
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
