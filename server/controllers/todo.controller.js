import { TodoModel } from "../models/todo.models.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "Provide all fields data",
        status: false,
      });
    }

    const todo = await TodoModel.create({
      title,
      description,
      priority,
      dueDate,
      createdBy: req.user._id,
    });

    return res.status(200).json({
      message: "Todo created successfully",
      todo,
      success: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      message: err.message,
      success: false,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, description, priority, dueDate, isCompleted } = req.body;

    //find Todo
    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      return res.status(400).json({
        message: "Todo not found",
        success: false,
      });
    }

    //check if logged in user is owner
    if (todo.createdBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        message: "You are not authorized to update this todo",
        success: false,
      });
    }

    if (title) todo.title = title;
    if (description) todo.description = description;
    if (priority) todo.priority = priority;
    if (dueDate) todo.dueDate = dueDate;
    if (typeof isCompleted === "boolean") todo.isCompleted = isCompleted;

    await todo.save();

    return res.status(200).json({
      message: "Todo updated successfully",
      todo,
      success: true,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
};

export const deletetodo = async (req,res)=>{
  try{
    const todoId = req.params.id;
    const todo = await TodoModel.findById(todoId);

    if(!todo){
      return res.status(404).json({
        message:"Task not found",
        success:false,
      })
    }

    if(todo.createdBy.toString() !== req.user._id.toString()){
      return res.status(400).json({
        message:"You are not authorize to delete todo",
        success:false,
      });
    }

    todo.deleted=true;
    todo.deletedAt = new Date();
    
    await todo.save();

    return res.status(200).json({
      message:"Todo moved to recycle bin , will be deleted within 24 hours",
      todo,
      success:false
    });

  }
  catch(err){
    return res.status(400).json({
      message:err.message,
      success:false,
    });
  }
}

export const getRecycleTodo = async (req, res) => {
  try {
    const todos = await TodoModel.find({
      deleted: true,
      createdBy: req.user._id,
    }).sort({ deletedAt: -1 }); // Optional: show recently deleted first

    return res.status(200).json({
      success: true,
      message: "All recycled todos fetched successfully",
      todos,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recycled todos",
      error: err.message,
    });
  }
};

export const restorerecycledtodos = async(req,res)=>{
  try{
    const todoId = req.params.id;
    const todo = await TodoModel.findOne({
      _id: todoId,
      createdBy: req.user._id,
      deleted: true,
    });


    if(!todo){
      return res.status(400).json({
        message:"Todo not found",
        success:false,
      });
    }

    todo.deleted=false;
    todo.deletedAt=null;

    await todo.save();

    return res.status(200).json({
      message:"Todo restored successfully",
      todo,
      success:true,
    });
  }
  catch(err){
    return res.status(400).json({
      message:err.message,
      success:false,
    });
  }
}

export const getalltodos = async(req,res)=>{
  try{
    const userId = req.user._id;
  const todos = await TodoModel.find({
    createdBy:userId,
    deleted:{$ne:true},
  });

  return res.status(200).json({
    message:"All active todos",
    todos,
    success:true,
  })
  }
  catch(err){
    return res.status(400).json({
      message:err.message,
      success:false,
    })
  }
}
