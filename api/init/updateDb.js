import User from "../models/user.models.js";
import Listing from "../models/listing.model.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({path : '../../.env'});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}

async function addOwnerListingToUser() {
    
    const users = await User.find(); 
    // const li = await Listing.find(); 
    // console.log(li);

    // for(const user of users){
        
    //     const userId = user._id;
    //     const userDoc = await User.findById(userId)

    //     const listings = await Listing.find({userRef : userId})

    //     userDoc.listings = listings;
    //     await userDoc.save()
    // }

    for (let index = 0; index < users.length; index++) {
        const userId = users[index]._id;
        
        const userDoc = await User.findById(userId)

        const listings = await Listing.find({userRef : userId})
        userDoc.listings = listings;
        await userDoc.save()
    }
}

async function clearBookings() {
    
    await User.updateMany({} , {$set :{
        userBookings : [],
        receivedBookings : [],
    }})
}

// addOwnerListingToUser()
clearBookings()