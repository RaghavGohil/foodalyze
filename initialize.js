import dotenv from "dotenv";
dotenv.config();

import { supabase } from "./src/services/supabaseClient.js";

async function createAdminUser() {
  //hackaround
  try {

    const { data, error } = await supabase.auth.admin.createUser({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Error creating admin user:", err);
  }
}

createAdminUser();
