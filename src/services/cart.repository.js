import { ProductService, TicketService } from "./index.js";

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

export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    createCart = async () => {
        try {
            const cart = {
                products: []
            };

            const res = await this.dao.createCart(cart);

            return res;
        }
        catch(error) {
            throw new FileError('Error while creating a cart: ' + error.message);
        }
        
    }

    getCartById = async (id) => {
        try {
            const cart = await this.dao.getCartById(id);
            return cart;
        }
        catch(error) {
            throw new FileError('Error while getting a cart: ' + error.message);
        }
    };

    addProductToCart = async (cid, pid, quantity) => {
        try {
            const isProductInCart = await this.dao.getProductById(cid, pid);
            let res;

            if(isProductInCart !== null) {
                res = await this.dao.updateProductQuantity(cid, pid, quantity || 1);
            } else {
                const newProduct = {
                    id: pid,
                    quantity: 1
                };

                res = await this.dao.addProductToCart(cid, newProduct);
            }
    
            return res;
        } catch (error) {
            console.error(error.message);
        }
    };

    deleteProductFromCart = async (cid, pid) => {
        try {
            const updatedCart = await this.dao.deleteProductFromCart(cid, pid);
    
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
            const updatedCart = await this.dao.updateCart(cid, products);
    
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
            const res = this.dao.deleteCart(cid);

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

    purchaseCart = async (cid, userEmail) => {
        let productsOutOfStock = [];
        let productsPurchased = [];
        let amount = 0;

        try {
            const cart = await this.getCartById(cid);
            const products = cart.products;
            
            for (const product of products) {
                const pid = product.id._id;
                const quantity = product.quantity;
                const hasStock = await this.validateProductStock(pid, quantity);

                if (hasStock) {
                    console.log(`Product ${pid} has sufficient stock`);
                    await ProductService.updateProductStock(pid, -quantity);
                    productsPurchased.push({ id: pid, quantity: quantity });
                    amount += product.id.price * product.quantity;
                } else {
                    productsOutOfStock.push({ id: pid, quantity: quantity });
                }
            }

        } catch (error) {
            throw new Error('Error purchasing cart: ' + error.message);
        } finally {
            console.log("productsPurchased:", productsPurchased)
            const purchase = {
                items: productsPurchased,
                amount: amount,
                purchase_datetime: new Date(),
                purchaser: userEmail
            };

            const ticket = await TicketService.createTicket(purchase);

            if (productsOutOfStock.length > 0) {
                await this.updateCart(cid, productsOutOfStock);
            }

            return { ticket, products_out_of_stock: productsOutOfStock }
        }
    }

    validateProductStock = async (pid, quantity) => {
        try {
            const product = await ProductService.getProductById(pid);
            const stock = product.stock;

            if(quantity > stock) {
                console.log(`Product ${pid} has insufficient stock`);
                return false;
            }

            return true;
        } catch (error) {
            throw new FileError('Error validating product stock: ' + error.message);
        }
    }
    
}