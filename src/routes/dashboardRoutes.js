import express from 'express';
import { getBarcodeFromImage , searchProduct } from '../controllers/dashboardController.js';
import multer from 'multer'
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { checkNormalUser } from '../middlewares/adminMiddlewares.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage})

router.get('/dashboard/search', isAuthenticated, checkNormalUser, (req, res) => {searchProduct(req, res)});
router.post('/api/dashboard/barcode', isAuthenticated, checkNormalUser, upload.single('image'),(req, res) => {getBarcodeFromImage(req, res)});

export default router;