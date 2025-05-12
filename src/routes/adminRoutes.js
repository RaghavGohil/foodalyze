import express from 'express';
import { getAdminDashboard, getAdminUserManagement, getAdminProductManagement, addProduct, deleteProduct, deleteUser} from '../controllers/adminController.js';
import { isAuthenticated } from "../middlewares/authMiddlewares.js";
import { isAdmin } from "../middlewares/adminMiddlewares.js";
import multer from 'multer'

const router = express.Router();
const upload = multer();

router.get('/admin', isAuthenticated, isAdmin ,(req, res) => {getAdminDashboard(req, res)});
router.get('/admin/user-management', isAuthenticated, isAdmin ,(req, res) => {getAdminUserManagement(req, res)});
router.post('/api/admin/user-management/delete', isAuthenticated, isAdmin ,(req, res) => {deleteUser(req, res)});
router.get('/admin/product-management', isAuthenticated, isAdmin ,(req, res) => {getAdminProductManagement(req, res)});
router.post('/api/admin/product-management/add', isAuthenticated, isAdmin, upload.single('productImage') ,(req, res) => {addProduct(req, res)});
router.post('/api/admin/product-management/delete', isAuthenticated, isAdmin ,(req, res) => {deleteProduct(req, res)});

export default router;