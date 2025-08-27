import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn-icons-png.flaticon.com/256/5989/5989400.png"
    },
    saved:{
      type:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'        
      }],
      unique: true
    },
    receivedBookings:{
      type : [
        {
          type : mongoose.Schema.Types.ObjectId,
          ref : 'Booking'
        }
      ]
    },
    userBookings : {
      type : [
        {
          type : mongoose.Schema.Types.ObjectId,
          ref:"Booking"
        }
      ]
    },
    listings:{
      type:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Listing'            
        }
      ],
      unique : true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;