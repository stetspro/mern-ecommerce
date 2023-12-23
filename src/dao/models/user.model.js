import mongoose from 'mongoose';
import 'dotenv/config';
import { cartModel } from './cart.model.js';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const userCollection = 'users';

const userSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: [true, "Name is required"] },
        last_name: { type: String },
        email: { type: String, required: [true, "Email is required"], unique: true },
        password: { type: String },
        role: { type: String, default: "USER_ROLE", enum: ["ADMIN_ROLE", "USER_ROLE"] },
        status: { type: Boolean, default: true },
        creationDate: { type: Date, default: Date.now },
        cart: { type: mongoose.Schema.Types.ObjectId, ref: cartModel }
    }
);

userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});

export const userModel = dbConnection.model(userCollection, userSchema);