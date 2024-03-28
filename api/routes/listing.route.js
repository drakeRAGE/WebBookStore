import express from 'express';
import { createListing } from '../controllers/listing.controllers.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/create', verifyToken, createListing);

export default router;
