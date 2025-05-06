import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { productInfo } from '../controllers/pageController.js';

const router = express.Router();

router.get('/', (req, res) => {res.render('login',{ layout:'auth', title:'Login'})});
router.get('/signup', (req, res) => {res.render('signup',{ layout:'auth', title:'Signup'})});
router.get('/dashboard', isAuthenticated ,(req, res) => {res.render('dashboard')});
router.get('/user-info', isAuthenticated ,(req, res) => {res.render('user_info')});
router.get('/product-upload', isAuthenticated ,(req, res) => {res.render('product_upload')});
router.get('/product-info', isAuthenticated, (req, res) => productInfo(req, res));
router.get('/health', isAuthenticated ,(req, res) => {res.render('health')});
router.get('/history', isAuthenticated ,(req, res) => {res.render('history')});
router.get('/thankyou', isAuthenticated ,(req, res) => {res.render('thankyou')});

export default router;