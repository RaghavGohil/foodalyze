import express from 'express';
import { searchProduct } from '../controllers/productController.js';

const router = express.Router();

router.get('/search', (req, res) => {searchProduct(req, res)});

export default router;