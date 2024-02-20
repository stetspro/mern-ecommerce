import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserModel } from './user.model';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 500 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true, required: true },
    category: { type: String, required: true, max: 100 },
    owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

productSchema.plugin(mongoosePaginate);

productSchema.pre('save', async function(next) {
    try {
        const owner = await UserModel.findById(this.owner);
        if (!owner) {
            throw new Error("Owner not found");
        }
        if (owner.role !== 'PREMIUM_ROLE' && owner.role !== 'ADMIN_ROLE') {
            throw new Error("Owner must have PREMIUM_ROLE or ADMIN_ROLE to create a product");
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const ProductModel = mongoose.model(productCollection, productSchema);