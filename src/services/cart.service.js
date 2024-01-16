import { cartModel } from '../dao/mongo/models/cart.model.js';
import { productModel } from '../dao/mongo/models/product.model.js';

export class CartNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CartNotFoundError";
    }
}

export class FileError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileError";
    }
}

export class CartManager {
    constructor() {
        this.cartModel = new cartModel();
    }

    createCart = async () => {
        try {
            const cart = {
                products: []
            };

            const res = await cartModel.create(cart);

            return res;
        }
        catch(error) {
            throw new FileError('Error while creating a cart: ' + error.message);
        }
        
    }

    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById(id).populate({ path: 'products.id', model: productModel}).lean();
            
            return cart;
        }
        catch(error) {
            throw new FileError('Error while getting a cart: ' + error.message);
        }
    };

    getCarts = async () => {
        try {
            const carts = await cartModel.find({}).lean();
            return carts;
        }
        catch(error) {
            throw new FileError('Error while getting carts: ' + error.message);
        };
    };

    addProductToCart = async (cid, pid, quantity) => {
        try {
            const isProductInCart = await cartModel.findOne({ _id: cid, 'products.id': pid }).lean();
            let res;

            if(isProductInCart !== null) {
                const query = { _id: cid, 'products.id': pid };
                const update = { $inc: { 'products.$.quantity': quantity ? quantity : 1 } };
                const options = { new: true, upsert: true };

                res = await cartModel.findOneAndUpdate(query, update, options);
            } else {
                res = this.addNewProductToCart(cid, pid);
            }
    
            return res;
        } catch (error) {
            console.error(error.message);
        }
    };

    addNewProductToCart = async (cid, pid) => {
        try {
            const newProduct = {
                id: pid,
                quantity: 1
            };
    
            const update = {
                $push: { products: newProduct }
            };
    
            const options = { new: true };
    
            const updatedCart = await cartModel.findByIdAndUpdate(cid, update, options).lean();
    
            return updatedCart;
        } catch (error) {
            console.error(error.message);
        }
    };

    deleteProductFromCart = async (cid, pid) => {
        try {
            const update = {
                $pull: { products: { id: pid } }
            };
    
            const options = { new: true };
    
            const updatedCart = await cartModel.findByIdAndUpdate(cid, update, options).lean();
    
            if (!updatedCart) {
                throw new Error("Product not found in cart");
            }

            return updatedCart;
        } catch (error) {
            throw new FileError('Error deleting product from cart: ' + error.message);
        }
    };    

    updateCart = async (cid, products) => {
        try {
            const query = { _id: cid };
            const update = { products: products };
            const options = { new: true };
    
            const updatedCart = await cartModel.findOneAndUpdate(query, update, options).lean();
    
            if (!updatedCart) {
                throw new CartNotFoundError("A cart with that ID does not exist.");
            }
    
            return updatedCart;
        } catch (error) {
            throw new FileError('Error updating cart: ' + error.message);
        }
    };

    deleteCart = async (cid) => {
        try {
            const res = this.updateCart(cid, []);

            return res;
        } catch (error) {
            throw new FileError('Error deleting cart products: ' + error.message);
        }
    }

    getCartSubtotal = async (cid) => {
        try {
            const cart = await this.getCartById(cid);
            const products = cart.products;
            let subtotal = 0;

            products.forEach(product => {
                subtotal += product.id.price * product.quantity;
            });

            return subtotal;
        } catch (error) {
            throw new FileError('Error getting cart subtotal: ' + error.message);
        }
    }
    
}