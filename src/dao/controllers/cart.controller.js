import { CartManager, CartNotFoundError } from '../services/cart.service.js';

const cartManager = new CartManager();

export const createCart = async (req, res) => {
    const data = req.body;
    try {
        const result = await cartManager.createCart(data);
        return res.sendSuccess(result);
    }
    catch(error) {
        res.sendServerError(error);
    }
    
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.getCartById(cid);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};

export const updateCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.updateCart(cid, req.body);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};

export const deleteCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.deleteCart(cid);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};

export const addProductInCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = parseInt(req.body.quantity);

    try {
        if(!quantity) {
            throw new Error("Quantity is required and must be a integer");
        }

        const result = await cartManager.addProductInCart(cid, pid, quantity);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};

export const addNewProductToCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartManager.addNewProductToCart(cid, pid);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};

export const deleteProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartManager.deleteProductFromCart(cid, pid);
        return res.sendSuccess(result);
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
};
