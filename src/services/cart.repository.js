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
    
}