import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim: true,
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique:true,
    },
    password:{
        type:String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    }
},{
    timestamps:true,
});
    
export const UserModel = mongoose.model('User',userSchema);