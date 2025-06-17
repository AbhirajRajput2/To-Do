import express from "express";
import jwt from 'jsonwebtoken'
import { UserModel } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { registerValidationSchema,loginSchema } from "../validators/user.validators.js";


export const Register = async (req, res) => {
  try {
    const { error } = registerValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
      });
    }
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Provide all fields data",
        success: false,
      });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists can't register",
        success: false,
      });
    }

    const hashesPassword = await bcryptjs.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashesPassword,
    });

    const { password: _, ...safeUser } = user._doc;

    return res.status(201).json({
      message: "User Registered Successfully",
      user: safeUser,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const Login = async(req,res)=>{
  try{
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        success: false,
      });
    }

    const {email,password} = req.body;
    if(!email || ! password){
      return res.status(400).json({
        message:"Enter all field for login",
        success:false,
      });
    }

    const user = await UserModel.findOne({email});
    if(!user){
      return res.status(404).json({
        message:"User doesn't exist with this email",
        success:false,
      });
    }

    const validatepass = await bcryptjs.compare(password,user.password);

    if(!validatepass){
      return res.status(401).json({
        message:"Incorrect Password",
        success:false,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {expiresIn:'1d'}
    )

    const {password:_ , ...safeUser} = user._doc;
    
    res.cookie("token",token,{
      httpOnly:true,
      maxAge:24*60*60*1000,
    })

    return res.status(400).json({
      message:"User login successfully",
      safeUser,
      success:true,
    });
  }
  catch(err){
    console.log(err.message);
    return res.status(200).json({
      message:"Server Error",
      success:false,
    })
  }
}

export const getUser = async(req,res)=>{
  try{
    const user = req.user;
    res.status(200).json({
    message:"User data fetched successfully",
    user,
    success:true,
    });
  }
  catch(err){
    console.log(err.message);
    return res.status(500).json({
      message:"Server error",
      success:false,
    });
  }
}

export const Logout = async(req,res)=>{
  try{
    res.cookie("token","",{
      httpOnly:true,
      expiresIn:new Date(0),
    });
    return res.status(200).json({
      message:"Logout successfully",
      success:true,
    })
  }
  catch(err){
    console.log(err.message);
    res.status(400).json({
      message:"Server error",
      success:false,
    })
  }
}