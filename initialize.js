import dotenv from 'dotenv'
dotenv.config()

import { supabase } from "./src/services/supabaseClient.js";

async function createAdminUser() { //hackaround
  const { data, error } = await supabase.auth.admin.createUser({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: {
      role: 'admin'
    }
  });
  if (error) {
    console.error('Error creating admin user:', error);
  } else {
    console.log('Admin user created successfully:', data.user);
  }
}

createAdminUser();