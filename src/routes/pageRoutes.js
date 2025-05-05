import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {res.render('login',{ layout:'auth', title:'Login'})});
router.get('/signup', (req, res) => {res.render('signup',{ layout:'auth', title:'Login'})});
router.get('/dashboard', (req, res) => {res.render('dashboard')});
router.get('/user-info', (req, res) => {res.render('user_info')});
router.get('/product-upload', (req, res) => {res.render('product_upload')});
router.get('/product-info', (req, res) => {res.render('product_info')});
router.get('/health', (req, res) => {res.render('health')});
router.get('/history', (req, res) => {res.render('history')});
router.get('/thankyou', (req, res) => {res.render('thankyou')});

export default router;