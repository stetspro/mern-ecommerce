import { ProductModel } from "./models/product.model.js";

export default class ProductDAO {
    constructor() {
        this.productModel = ProductModel;
    }

    async getProducts(query, options) {
        return await this.productModel.paginate(query, options);
    }

    async getProductById(id) {
        return await this.productModel.findById(id).lean();
    }

    async getProductByCode(code) {
        return await this.productModel.find({ code });
    }

    async createProduct(product) {
        return await this.productModel.create(product);
    }

    async updateProduct(id, product) {
        return await this.productModel.findByIdAndUpdate(id, product, { new: true }).lean();
    }

    async deleteProduct(id) {
        return await this.productModel.findByIdAndDelete(id).lean();
    }

    async updateProductStock(id, quantity) {
        return await this.productModel.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true }).lean();
    }

    async getProductOwner(id) {
        return await this.productModel.findById(id).select({ owner: 1, _id: 0 });
    }
}