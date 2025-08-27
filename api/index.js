import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import mongoose  from 'mongoose';
import UserRouter from './routes/user.route.js'
import AuthRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js';
import BookingRouter from './routes/booking.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';

const PORT = process.env.PORT || 3000;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
}
const app = express()


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

app.use(express.json())
app.use(cookieParser())


app.use('/api/user' , UserRouter)
app.use('/api/auth' , AuthRouter)
app.use('/api/listing' , listingRouter)
app.use('/api/booking' , BookingRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err , req , res , next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "kuch to gadbad he daya";

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})

app.listen(PORT , ()=>{
    console.log(`server running at : http://localhost:${PORT}`);
})