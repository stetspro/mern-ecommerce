import { CartModel } from "./models/cart.model.js";
import { ProductModel } from "./models/product.model.js";

export default class CartDAO {
    constructor() {
        this.cartModel = CartModel;
    }

    async getCart() {
        return await this.cartModel.find();
    }

    async getCartById(id) {
        return await this.cartModel.findById(id).populate({ path: 'products.id', model: ProductModel}).lean();
    }

    async createCart(cart) {
        return await this.cartModel.create(cart);
    }

    async updateCart(id, products) {
        return await this.cartModel.findOneAndUpdate(
            { _id: id }, 
            { products: products },
            { new: true }
        ).lean();
    }

    async deleteCart(id) {
        return await this.cartModel.findByIdAndDelete(id);
    }

    async getProductById(cid, pid) {
        return await this.cartModel.findOne({ _id: cid, 'products.id': pid }).lean();
    }

    async addProductToCart(cid, product) {
        return await this.cartModel.findByIdAndUpdate(
            cid, 
            { $push: { products: product } },
            { new: true }
        ).lean();
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await this.cartModel.findOneAndUpdate(
            { _id: cid, 'products.id': pid }, 
            { $inc: { 'products.$.quantity': quantity } }, 
            { new: true, upsert: true }
        ).lean();
    }

    async deleteProductFromCart(cid, pid) {
        return await this.cartModel.findOneAndUpdate(
            { _id: cid }, 
            { $pull: { products: { id: pid } } }, 
            { new: true }
        ).lean();
    }
}