import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({

    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
        required: true,
    },
    resolvedAt: {
        type: Date,
    },
    appliedFor :{
        type : String,
        enum: ["buy", "rent"],
        required : true,
    },
    booker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    bookerMessage: {
        type: String,
        default: "Please reply at the earliest",
        required: true,
    },
    responseMessage: {
        type: String,
    },
    checkInDate: {
        type: Date,
    },
    checkOutDate: {
        type: Date,
    }
},
    { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;