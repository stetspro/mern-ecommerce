import { Router } from "express";
import { getMessages } from "../dao/controllers/chat.controller.js";

const router = Router();

router.get("/", getMessages);

export default router;