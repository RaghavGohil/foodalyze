import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {res.render('login',{ layout:'auth_layout', title:'Login'})});
router.get('/signup', (req, res) => {res.render('signup',{ layout:'auth_layout', title:'Signup'})});

router.post('/api/auth/signup', (req, res) => signup(req, res));
router.post('/api/auth/login', (req, res) => login(req, res));
router.post('/api/auth/logout', (req, res) => logout(req, res));

export default router;