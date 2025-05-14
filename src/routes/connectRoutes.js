import express from 'express'
import { isAuthenticated } from '../middlewares/authMiddlewares.js'
import { sendMail } from '../controllers/connectController.js'

const router = express.Router()

router.post('/api/connect/send-mail',isAuthenticated,(req, res) => sendMail(req,res))

export default router;