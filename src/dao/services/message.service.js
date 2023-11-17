import { messageModel } from '../models/message.model.js';

export class MessageManager {
    constructor() {
        this.messageModel = new messageModel();
    }

    saveMessage = async ({ user, message }) => {
        try {
            if(!user || !message) {
                throw new Error("You must fill all the required fields.");
            }
    
            const messageDoc = {
                user,
                message
            };
    
            const res = await messageModel.create(messageDoc);

            return res._id;
        }
        catch(error) {
            throw new Error('Error while saving message: ' + error.message);
        }   
    }

    getAllMessages = async () => {
        try {
            const messages = await messageModel.find({}).lean();
            return messages;
        }
        catch(error) {
            throw new Error('Error while getting messages: ' + error.message);
        };
    };
}