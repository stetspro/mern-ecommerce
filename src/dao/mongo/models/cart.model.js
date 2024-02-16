import mongoose from 'mongoose';
import 'dotenv/config';

const cartCollection = 'carts';

const CartSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    products: {
        type: [
            {
                _id: false,
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                    type: Number,
                    required: [true, "Quantity is required"]
                }
            }
        ],
        default: []
    }
});

CartSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

export const CartModel = mongoose.model(cartCollection, CartSchema);