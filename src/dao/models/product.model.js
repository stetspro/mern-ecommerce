import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import 'dotenv/config';

const dbConnection = mongoose.createConnection(process.env.MONGO_URI_ECOMMERCE);

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 500 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    code: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    status: { type: Boolean, required: true },
    category: { type: String, required: true, max: 100, enum: ['toys', 'decoration', 'accesories'] }
});

productSchema.plugin(mongoosePaginate);

export const productModel = dbConnection.model(productCollection, productSchema);