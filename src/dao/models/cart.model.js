import mongoose from 'mongoose';
import 'dotenv/config';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                }
            }
        ],
        default: []
    }
});

cartSchema.pre('findOne', function() {
    this.populate('products.product');
});

export const cartModel = dbConnection.model(cartCollection, cartSchema);