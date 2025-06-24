import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.models.js';

export const isAuthenticated = async(req,res,next)=>{
    try{
        const token = req.cookies.token;

        if(!token){
            req.user=null;
            return next();
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        const user =await UserModel.findOne(decoded._id).select("-password");
        if (!user) {
             req.user = null;
             return next();
        }

        req.user = user;
        next();


    }
    catch(err){
        console.log(err.message);
        return res.status(200).json({
            message:"server error",
            success:false,
        })
    }
}