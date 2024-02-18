import mongoose from "mongoose";

const tokenCollection = "tokens";

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: '1h'
        },
    }
});

export const TokenModel = mongoose.model(tokenCollection, tokenSchema);