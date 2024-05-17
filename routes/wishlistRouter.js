import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { renderAddWishlistsPage, handleAddWishlists } from '../controller/wishlistController.js';

const router = express.Router();

router.get('/addWishlists', authMiddleware(['Teacher']), renderAddWishlistsPage);

router.post('/addWishlists', authMiddleware(['Teacher']), handleAddWishlists);

export default router;
