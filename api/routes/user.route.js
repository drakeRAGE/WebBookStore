import express, { application } from 'express';
import { test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser);

export default router;
