import fs from 'fs';
import { ProductManager } from './product.fs.service.js';
import { cartModel } from '../models/cart.model.js';

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

            return id;
        }
        catch(error) {
            throw new FileError('Error while creating a cart: ' + error.message);
        }
        
    }

    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById(id).lean();
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

    getCartProducts = async (cid) => {
        const cart = await this.getCartById(cid);

        if(!cart) {
            throw new CartNotFoundError("A cart with that ID does not exist.");
        };

        const productManager = new ProductManager();

        const productsPromises = cart?.products?.map(async (item) => {
            const pid = item.product;
            const product = await productManager.getProductById(pid);
            product.quantity = item.quantity;
            return product;
        });
    
        const products = await Promise.all(productsPromises);
        return products;
    }

    addProductsToCart = async (cid, pid) => {
        try {
            const cart = await this.getCartById(cid);
            
            if(!cart) {
                throw new CartNotFoundError("A cart with that ID does not exist.");
            };
        
            const existingProductIndex = cart.products.findIndex(item => item.product === pid);
        
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++;
            } else {
                cart.products.push({
                    product: pid,
                    quantity: 1,
                });
            }
        
            cartModel.findByIdAndUpdate(cid, cart, { new: true }).lean();

            return cart;
        }
        catch(error) {
            throw new FileError('Error adding product to cart: ' + error.message);
        }
    }
    
}