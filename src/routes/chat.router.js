import { Router } from "express";
import { MessageManager }  from '../dao/services/message.service.js';

const router = Router();
const messageManager = new MessageManager();

router.get("/", async (req, res) => {
    const messages = await messageManager.getAllMessages();
    res.render("chat", { messages });
});

export default router;