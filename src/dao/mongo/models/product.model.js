import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import 'dotenv/config';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 500 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true, required: true },
    category: { type: String, required: true, max: 100 }
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(productCollection, productSchema);