import { MessageManager } from "../services/message.service.js";

const messageManager = new MessageManager();

export const getMessages = async (req, res) => {
    const messages = await messageManager.getAllMessages();
    res.render("chat", { messages });
};