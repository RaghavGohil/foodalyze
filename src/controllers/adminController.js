import { supabase } from "../services/supabaseClient.js";
import { prisma } from "../services/prismaClient.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // Fetch users (first page, up to 100 users)
    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });
    if (usersError) throw usersError;

    // Fetch total products added today
    const { data, error: productsError } = await supabase
      .from("Product")
      .select("*");
    if (productsError) throw productsError;

    const totalSearches = [];
    const today = new Date(); // Only create once outside the loop

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today); // Clone the current date
      date.setDate(today.getDate() - i); // Move back i days
      const day = date.toISOString().split("T")[0];
      const from = `${day}T00:00:00Z`;
      const to = `${day}T23:59:59Z`;

      const { count, error } = await supabase
        .from("SearchHistory")
        .select("*", { count: "exact", head: true })
        .gte("createdAt", from)
        .lte("createdAt", to); // You can also use lte to include the full day

      if (error) throw error;
      totalSearches.push(count); // Store count even if it's 0
    }

    // Render the admin dashboard with the fetched statistics
    res.render("admin", {
      section: "dashboard",
      stats: {
        totalUsers: users.length - 1,
        totalProducts: data.length,
        totalSearches,
      },
      layout: "admin_layout",
      title: "admin",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Server error");
  }
};

export const getAdminUserManagement = async (req, res) => {
  const search = req.query.search?.toLowerCase() || "";

  try {
    // Step 1: Fetch auth users (up to 100)
    const {
      data: { users: authUsers, total },
      error: authError,
    } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (authError) throw authError;

    // Step 2: Extract user IDs
    const authUserIds = authUsers.map((user) => user.id);

    // Step 3: Query your custom users table for names
    const { data: userDetails, error: userError } = await supabase
      .from("User")
      .select("authUserId, name")
      .in("authUserId", authUserIds);

    if (userError) throw userError;

    // Step 4: Create a map from authUserId to name
    const userMap = {};
    userDetails.forEach((u) => {
      userMap[u.authUserId] = u.name;
    });

    // Step 5: Attach name to each auth user
    let users = authUsers.map((user) => ({
      ...user,
      name: userMap[user.id] || null,
    }));

    // Step 6: Exclude admin
    users = users.filter((u) => u.email !== process.env.ADMIN_EMAIL);

    // Step 7: Apply regex-like filtering if search is present
    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      users = users.filter(
        (u) => regex.test(u.email) || regex.test(u.name || "")
      );
    }

    res.render("admin", {
      section: "users",
      users,
      layout: "admin_layout",
      title: "Admin",
    });
  } catch (error) {
    console.error("dashboard error:", error);
    res.status(500).send("server error");
  }
};

export const getAdminProductManagement = async (req, res) => {
  try {
    // Fetch all products from Supabase
    const { data: products, error: productError } = await supabase
      .from("Product")
      .select("*");

    if (productError) throw productError;

    // Convert hex to buffer and then to base64 for each product image
    const processedProducts = products.map((product) => {
      let base64Image = null;
      if (product.productImage) {
        // Remove '\x' prefix from the hex string and convert it to a buffer
        const hexString = product.productImage.replace(/\\x/g, ""); // Removing the '\x' parts
        const hexBuffer = Buffer.from(hexString, "hex");
        // Convert the buffer to base64
        base64Image = `data:image/jpeg;base64,${hexBuffer.toString("base64")}`;
      }
      return {
        ...product,
        base64Image, // add base64 image to each product
      };
    });

    // Render the admin view with the processed product data
    res.render("admin", {
      section: "products",
      layout: "admin_layout",
      title: "admin",
      products: processedProducts, // send updated product list with base64 images
    });
  } catch (error) {
    console.error("dashboard error:", error);
    res.status(500).send("server error");
  }
};

// other functions

export const deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing userId" });
  }

  try {
    // 1. Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Delete from your custom users table
    const { error: userTableError } = await supabase
      .from("User")
      .delete()
      .eq("authUserId", userId);

    if (userTableError) throw userTableError;

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      brandName,
      barcode,
      allergens,
      ingredients,
      packagingDetails,
      categories,
      nutriScore,
      novaScore,
      data, // assumed to be JSON string or omitted
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Missing productImage file" });
    }

    const imageBuffer = req.file.buffer;

    const newProduct = await prisma.product.create({
      data: {
        productName,
        brandName,
        barcode,
        allergens,
        ingredients,
        packagingDetails,
        categories,
        nutriScore,
        novaScore: parseInt(novaScore),
        data: data ? JSON.parse(data) : {}, // optional JSON parsing
        productImage: imageBuffer,
      },
    });

    res.redirect('/admin/product-management')
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing productId" });
  }

  try {
    // Delete the product from the Product table
    const { error: productDeleteError } = await supabase
      .from("Product")
      .delete()
      .eq("id", productId);

    if (productDeleteError) throw productDeleteError;

    res.redirect('/admin/product-management')
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
