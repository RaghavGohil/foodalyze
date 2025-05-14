import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {res.render('login',{ layout:'auth_layout', title:'Login'})});
router.get('/signup', (req, res) => {res.render('signup',{ layout:'auth_layout', title:'Signup'})});

router.post('/api/auth/signup', (req, res) => signup(req, res));
router.post('/api/auth/login', (req, res) => login(req, res));
//router.post('/api/auth/signin-with-google', (req, res) => signinWithGoogle(req, res));
//router.get('/auth/signin-with-google/callback', (req, res) => getCallbackPage(req, res));
//router.post('/api/auth/signin-with-google/google-token-handler', (req, res) => googleTokenHandler(req, res));
router.post('/api/auth/logout', (req, res) => logout(req, res));

export default router;