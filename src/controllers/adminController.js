import { supabase } from "../services/supabaseClient.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // fetch users (first page, up to 100 users)
    const { data: { users, total }, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perpage: 100
    });
    if (error) throw error;

    // users is an array of user records
    // total is the total count across all pages
    const totalUsers = total;

    // just as a placeholder here
    const totalProducts = 10;

    res.render('admin', {
      section: 'dashboard',
      stats: { totalUsers, totalProducts },
      layout: 'admin_layout',
      title: 'admin'
    });
  } catch (error) {
    console.error('dashboard error:', error);
    res.status(500).send('server error');
  }
};

export const getAdminUserManagement = async (req, res) => {
  try {
    // fetch users (first page, up to 100 users)
    const { data: { users, total }, error } = await supabase.auth.admin.listusers({
      page: 1,
      perpage: 100
    });
    if (error) throw error;

    // users is an array of user records
    // total is the total count across all pages
    const totalusers = total;

    // just as a placeholder here
    const totalproducts = 10;

    res.render('admin', {
      section: 'users',
      stats: { totalusers, totalproducts },
      layout: 'admin_layout',
      title: 'admin'
    });
  } catch (error) {
    console.error('dashboard error:', error);
    res.status(500).send('server error');
  }
};

export const getAdminProductManagement = async (req, res) => {
  try {
    // fetch users (first page, up to 100 users)
    const { data: { users, total }, error } = await supabase.auth.admin.listusers({
      page: 1,
      perpage: 100
    });
    if (error) throw error;

    // users is an array of user records
    // total is the total count across all pages
    const totalusers = total;

    // just as a placeholder here
    const totalproducts = 10;

    res.render('admin', {
      section: 'products',
      stats: { totalusers, totalproducts },
      layout: 'admin_layout',
      title: 'admin'
    });
  } catch (error) {
    console.error('dashboard error:', error);
    res.status(500).send('server error');
  }
};