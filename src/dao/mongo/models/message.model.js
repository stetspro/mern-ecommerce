import mongoose from 'mongoose';
import 'dotenv/config';

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema(
    {
        user: String,
        message: String
    }
);

export const MessageModel = mongoose.model(messageCollection, messageSchema);