import mongoose from 'mongoose';
import 'dotenv/config';
import { productSchema } from './product.model.js';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    timestamp: { type: Date, default: Date.now },
    products: [{ type: productSchema, required: true }]
});

export const cartModel = dbConnection.model(cartCollection, cartSchema);