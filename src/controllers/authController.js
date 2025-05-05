import { PrismaClient } from '@prisma/client';
import { supabase } from '../services/supabaseClient.js'

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  const { email, password, name, phone, gender } = req.body;
  try {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Create user in Prisma database with Supabase user ID and optional fields
    const newUser = await prisma.user.create({
      data: {
        name,      
        phone,     
        email,
        password,
        gender,    
        //supabaseUserId: data.id,  // Relating Prisma user with Supabase user by user ID
      },
    });
    res.status(200).json({ message: 'Signup successful', user: newUser });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.status(200).json({ message: 'Login successful', access_token: data.session.access_token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (_req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
