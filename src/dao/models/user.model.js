import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const userCollection = 'users';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, "Name is required"] },
        lastName: { type: String, required: [true, "Last name is required"] },
        email: { type: String, required: [true, "Email is required"], unique: true },
        password: { type: String, required: [true, "Password is required"] },
        role: { type: String, default: "USER_ROLE", enum: ["ADMIN_ROLE", "USER_ROLE"] },
        status: { type: Boolean, default: true },
        creationDate: { type: Date, default: Date.now }
    }
);

userSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});

export const userModel = dbConnection.model(userCollection, userSchema);