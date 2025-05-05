import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

export default function (supabase) {
  router.post('/signup', (req, res) => signup(req, res, supabase));
  router.post('/login', (req, res) => login(req, res, supabase));
  router.post('/logout', (req, res) => logout(req, res, supabase));

  return router;
}