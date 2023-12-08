import { Router } from "express";
import { getMessages } from "../dao/controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, getMessages);

export default router;