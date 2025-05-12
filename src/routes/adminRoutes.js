import express from 'express';
import { getAdminDashboard, getAdminUserManagement, getAdminProductManagement } from '../controllers/adminController.js';
import { isAuthenticated } from "../middlewares/authMiddlewares.js";
import { isAdmin } from "../middlewares/adminMiddlewares.js";

const router = express.Router();

router.get('/admin', isAuthenticated, isAdmin ,(req, res) => {getAdminDashboard(req, res)});
router.get('/admin/user-management', isAuthenticated, isAdmin ,(req, res) => {getAdminUserManagement(req, res)});
router.get('/admin/product-management', isAuthenticated, isAdmin ,(req, res) => {getAdminProductManagement(req, res)});

export default router;