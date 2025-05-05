import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {res.render('login')});
router.get('/signup', (req, res) => {res.render('signup')});
router.get('/dashboard', (req, res) => {res.render('dashboard')});
router.get('/user-info', (req, res) => {res.render('user_info')});
router.get('/product-upload', (req, res) => {res.render('product_upload')});
router.get('/product-info', (req, res) => {res.render('product_info')});
router.get('/health', (req, res) => {res.render('health')});
router.get('/history', (req, res) => {res.render('history')});
router.get('/final-pg', (req, res) => {res.render('finalpg')});

export default router;