import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', (req, res) => signup(req, res));
router.post('/login', (req, res) => login(req, res));
router.post('/logout', (req, res) => logout(req, res));

export default router;