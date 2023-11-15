import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const messageCollection = 'messages';

const messageSchema = new mongoose.Schema({
    messages: [{
        author: {
            id: String,
            name: String,
            lastname: String,
            age: Number,
            alias: String,
            avatar: String
        },
        text: String,
        date: Date
    }]
});

export const messageModel = dbConnection.model(messageCollection, messageSchema);