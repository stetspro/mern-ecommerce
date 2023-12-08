import { CartManager, CartNotFoundError } from '../services/cart.service.js';

const cartManager = new CartManager();

export const createCart = async (req, res) => {
    const data = req.body;
    try {
        const result = await cartManager.createCart(data);
        return res.status(200).json({ result });
    }
    catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.getCartById(cid);
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
};

export const updateCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.updateCart(cid, req.body);
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error });
        }
    }
};

export const deleteCart = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await cartManager.deleteCart(cid);
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error });
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
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const addNewProductToCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartManager.addNewProductToCart(cid, pid);
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

export const deleteProductFromCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const result = await cartManager.deleteProductFromCart(cid, pid);
        return res.status(200).json({ result });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};
