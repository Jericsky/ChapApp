import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware';
import { getUsersForSidebars, getMessages, sendMessage } from '../controllers/message.controllers';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebars);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);


export default router;