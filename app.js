// Env config
import dotenv from 'dotenv';
dotenv.config();

// supabaseClient.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;  // Get this from your Supabase project
const supabaseKey = process.env.SUPABASE_KEY;  // Get this from your Supabase project
const supabase = createClient(supabaseUrl, supabaseKey);

import express from 'express';
// Routes
import authRoutes from './src/routes/authRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes(supabase));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
