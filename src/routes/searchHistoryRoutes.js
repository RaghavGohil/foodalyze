import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddlewares.js';
import { checkNormalUser} from '../middlewares/adminMiddlewares.js';
import { deleteSearchHistory, getProductDetails, getSearchHistory } from '../controllers/searchHistoryController.js'

const router = express.Router();

router.get('/search-history', isAuthenticated ,checkNormalUser,(req, res) => {getSearchHistory(req, res)});
router.post('/api/search-history/delete', isAuthenticated ,checkNormalUser,(req, res) => {deleteSearchHistory(req, res)});
router.get('/search-history/product-info', isAuthenticated ,checkNormalUser,(req, res) => {getProductDetails(req, res)});

export default router;