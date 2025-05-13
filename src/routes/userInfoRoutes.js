import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { checkNormalUser} from '../middlewares/adminMiddlewares.js';
import { getUserInfo, updateUserInfo} from '../controllers/userInfoController.js';

const router = express.Router();

router.get('/user-info', isAuthenticated ,checkNormalUser,(req, res) => {getUserInfo(req, res)});
router.post('/api/user-info/update', isAuthenticated, checkNormalUser,(req, res) => {updateUserInfo(req, res)});

export default router;