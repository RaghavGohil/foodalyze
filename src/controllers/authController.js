import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const signup = async (req, res, supabase) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Save to your Prisma User table
    await prisma.user.create({ data: { email } });
    res.status(200).json({ message: 'Signup successful', user: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res, supabase) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.status(200).json({ message: 'Login successful', access_token: data.session.access_token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logout = async (_req, res, supabase) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
