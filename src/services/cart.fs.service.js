import fs from 'fs';
import { ProductManager } from './product.fs.service.js';

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
        this.path = 'cartDB.json';
    }

    #getNextID = async () => {
        const carts = await this.getCarts();
        const count = carts.length;
        if(count === 0) return 1;

        const position = count - 1;
        const lastCart = carts[position] ;

        return lastCart.id + 1;
    }

    createCart = async () => {
        try {
            const id = await this.#getNextID();

            const cart = {
                id,
                products: []
            };

            const carts = await this.getCarts();
            carts.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts));

            return id;
        }
        catch(error) {
            throw new FileError('Error while creating a cart: ' + error.message);
        }
        
    }

    getCartById = async (id) => {
        let carts = await this.getCarts();
  
        return carts?.find(p => p.id === id) ?? -1;
    };

    getCarts = async () => {
        try {
            await this.#fileExist(this.path);

            let data = await fs.promises.readFile(this.path);
            data = JSON.parse(data);
            return data;
        }
        catch(error) {
            throw new FileError('Error while getting carts: ' + error.message);
        };
    };

    getCartProducts = async (cid) => {
        const cart = await this.getCartById(cid);

        if(cart === -1) {
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
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(item => item.id === cid);
            
            if(cartIndex == -1) {
                throw new CartNotFoundError("A cart with that ID does not exist.");
            };
        
            const cart = carts[cartIndex];
        
            const existingProductIndex = cart.products.findIndex(item => item.product === pid);
        
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++;
            } else {
                cart.products.push({
                    product: pid,
                    quantity: 1,
                });
            }
        
            carts[cartIndex] = cart;
        
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

            return cart;
        }
        catch(error) {
            throw new FileError('Error adding product to cart: ' + error.message);
        }
    }

    #fileExist = async (path) => {
        try {
            const stats = fs.existsSync(path);
    
            if (stats == false) {
                await fs.promises.writeFile(path, "[]");
            };
        }
        catch(error) {
            throw new FileError('Error ensuring file existence: ' + error.message);
        };
    };
    
}