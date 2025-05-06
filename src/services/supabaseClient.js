// Env config
import dotenv from 'dotenv';
dotenv.config();

// Supabase 
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;  // Get this from your Supabase project
const supabaseKey = process.env.SUPABASE_KEY;  // Get this from your Supabase project
export const supabase = createClient(supabaseUrl, supabaseKey);