import express from 'express'
import {updateUserInfo , deleteUser , getUserListings , getUser , saveListing , getSavedListings} from '../controllers/user.controller.js'
import { isLoggedIn } from '../utils/authMiddleware.js';

const router = express.Router();

// router.get('/' , )

router.post('/update/:id' ,isLoggedIn , updateUserInfo)
router.post('/save/:listingId' ,isLoggedIn , saveListing)
router.delete('/delete/:id', isLoggedIn, deleteUser)
router.get('/saved/listings', isLoggedIn, getSavedListings)
router.get('/listings/:id', isLoggedIn, getUserListings)
router.get('/:id', getUser)

export default router;