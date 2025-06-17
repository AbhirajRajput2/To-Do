import express from 'express'
import dotenv from 'dotenv'
import UserRoutes from './routes/user.route.js';
import connectDB from './utils/db.config.js';
import cookieParser from 'cookie-parser';

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("hii");
})
app.use("/api/user",UserRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log("Server is running on port :",PORT);
})