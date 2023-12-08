import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser 
} from "../dao/controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

export default router;