import express from 'express'
import { Register,Login, Logout, getUser } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/register",Register);
router.post("/login",Login);
router.get("/logout",Logout);
router.get("/loggedUser",isAuthenticated,getUser);

export default router;