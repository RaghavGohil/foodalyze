import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { productInfo } from '../controllers/productInfoController.js';
import { checkNormalUser } from '../middlewares/adminMiddlewares.js';

const router = express.Router();

router.get('/dashboard', isAuthenticated, checkNormalUser,(req, res) => {res.render('dashboard')});
router.get('/product-upload', isAuthenticated, checkNormalUser ,(req, res) => {res.render('product_upload')});
router.get('/product-info', isAuthenticated, checkNormalUser, (req, res) => productInfo(req, res));
router.get('/health', isAuthenticated ,checkNormalUser,(req, res) => {res.render('health')});
router.get('/connect', isAuthenticated ,checkNormalUser,(req, res) => {res.render('connect')});
router.get('/thankyou', isAuthenticated ,checkNormalUser,(req, res) => {res.render('thankyou')});

export default router;