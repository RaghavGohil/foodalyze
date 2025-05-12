// Env config
import dotenv from 'dotenv';
dotenv.config();

// Supabase 
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.SUPABASE_URL;  // Get this from your Supabase project
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;  // Get this from your Supabase project
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);