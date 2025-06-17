import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const connectDB = async()=>{
    try{
     await mongoose.connect(MONGO_URI);
     console.log("Connected to DB Successfully");
    }
    catch(err){
        console.log(err.message);
    }
}

export default connectDB;