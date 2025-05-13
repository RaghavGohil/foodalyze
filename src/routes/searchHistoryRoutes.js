import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { checkNormalUser} from '../middlewares/adminMiddlewares.js';
import { getSearchHistory } from '../controllers/searchHistoryController.js'

const router = express.Router();

router.get('/search-history', isAuthenticated ,checkNormalUser,(req, res) => {getSearchHistory(req, res)});

export default router;