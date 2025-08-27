import express from 'express'
import {createBooking , resolveBooking , getMyBookings , getReceivedBookings} from '../controllers/booking.controller.js'
import {isLoggedIn} from '../utils/authMiddleware.js'

const router = express.Router();

router.get('/user-bookings' , isLoggedIn , getMyBookings)
router.get('/received-bookings' , isLoggedIn , getReceivedBookings)
router.post('/create' , isLoggedIn , createBooking)
router.post('/resolve' , isLoggedIn , resolveBooking)

export default router