import { MessageModel } from "./models/message.model.js";

export default class Message {
    constructor() {
        this.messageModel = MessageModel;
    }

    async getMessages() {
        return await this.messageModel.find({}).lean();
    }

    async getMessageById(id) {
        return await this.messageModel.findById(id);
    }

    async createMessage(message) {
        return await this.messageModel.create(message);
    }

    async updateMessage(id, message) {
        return await this.messageModel.findByIdAndUpdate(id, message);
    }

    async deleteMessage(id) {
        return await this.messageModel.findByIdAndDelete(id);
    }
}