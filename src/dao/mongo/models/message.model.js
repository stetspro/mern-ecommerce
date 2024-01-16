import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema(
    {
        user: String,
        message: String
    }
);

export const messageModel = dbConnection.model(messageCollection, messageSchema);