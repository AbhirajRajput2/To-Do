import express from 'express'
import { createTodo, deletetodo, getalltodos, getRecycleTodo, restorerecycledtodos, updateTodo } from '../controllers/todo.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/create",isAuthenticated,createTodo);
router.put("/update/:id",isAuthenticated,updateTodo);
router.delete("/delete/:id",isAuthenticated,deletetodo);
router.get("/getrecycledtodos",isAuthenticated,getRecycleTodo);
router.get("/restorerecycledtodos/:id",isAuthenticated,restorerecycledtodos)
router.get("/getalltodos",isAuthenticated,getalltodos)
export default router;