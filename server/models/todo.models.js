import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    title:{
        type:String,
        required: [true, "Title is required"], 
        trim:true,   
    },
    description:{
        type:String,
        required:true,
        trim:true,   
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    isCompleted:{
        type:Boolean,
        default:false,
    },
    priority:{
        type:String,
        enum:["low","mid","high"],
        default:"low",
    },
    dueDate:{
        type:Date,
    },
    deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null,
    }
},{
    timestamps:true,
});

export const TodoModel = mongoose.model("Todo",todoSchema);