import express from 'express';
import { createListing , deleteListing , updateListing , getListing , getListings , saveListing} from '../controllers/listing.controller.js';
import { isLoggedIn } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/create', isLoggedIn, createListing);
router.post('/save/:id', isLoggedIn, saveListing);
router.delete('/delete/:id', isLoggedIn, deleteListing);
router.post('/update/:id', isLoggedIn, updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);

export default router;