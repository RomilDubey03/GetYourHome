import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.models.js";
import { errorhandler } from "../utils/error.js";

const createBooking = async (req , res , next) => {

    try {
        const { listingId, ownerId, bookerMessage, checkInDate, checkOutDate , appliedFor} = req.body;
        const userId = req.user.id
        // const listingDoc = await Listing.findById(listingId);
        // const ownerDoc = await Listing.findById(ownerId);

        const bookingDoc = await Booking.create({
            booker: userId,
            owner: ownerId,
            bookerMessage,
            checkInDate : checkInDate ? checkInDate : Date.now(),
            checkOutDate : checkOutDate ? checkOutDate : Date.now(),
            appliedFor,
            status: "pending",
        })

        //updating the booker
        const {userBookings} = await User.findByIdAndUpdate(userId, { $push: { userBookings: bookingDoc._id } } , {new:true})
        const {receivedBookings} = await  User.findByIdAndUpdate(ownerId, { $push: { receivedBookings: bookingDoc._id } } , {new:true})

        res.status(201).json({bookingDoc , userBookings , receivedBookings })

    } catch (error) {
        next(error)
    }

}

const resolveBooking = async (req , res , next)=>{
    //owner is the the req.user
    try {
        const {responseMessage , bookingId , status , resolvedAt} = req.body;
        const bookingDoc = await Booking.findById(bookingId);

        if(bookingDoc.owner != req.user.id){
            return next(errorhandler(401 , "Only the owner can resolve the booking"))
        }

        bookingDoc.responseMessage = responseMessage ?responseMessage :  "";
        bookingDoc.resolvedAt = resolvedAt
        bookingDoc.status = status;

        await bookingDoc.save()
        
        res.status(200).json(bookingDoc)
    } catch (error) {
       next(error) 
    }
}

const getMyBookings = async (req , res , next)=>{
    
    try {
        const {userBookings} = await User.findById(req.user.id)
        .populate({
            path : 'userBookings',
            options: { sort: { createdAt: -1 } },
            populate : {
                path : 'owner',
                model : 'User',
                select : "username email"
            }
        })        
        res.status(201).json(userBookings)        
    } catch (error) {
        next(error)
    }

}
const getReceivedBookings = async (req , res , next)=>{

    try {
        const {receivedBookings} = await User.findById(req.user.id)        
        .populate({
            path : 'receivedBookings',
            options: { sort: { createdAt: -1 } },
            populate : {
                path : 'booker',
                model : 'User',
                select : "username email"
            }
        })
        res.status(201).json(receivedBookings)        
    } catch (error) {
        next(error)
    }

}

export {
    createBooking,
    resolveBooking,
    getMyBookings,
    getReceivedBookings,
}