import express from 'express';
import { getBarcodeFromImage , searchProduct } from '../controllers/dashboardController.js';
import multer from 'multer'

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage})

router.get('/dashboard/search', (req, res) => {searchProduct(req, res)});
router.post('/api/dashboard/barcode', upload.single('image'),(req, res) => {getBarcodeFromImage(req, res)});

export default router;