import { CartService } from "../repositories/index.js";
import CustomError from "../utils/errors/custom.errors.js";

export const createCart = async (req, res) => {
    try {
        const result = await CartService.createCart();
        return res.sendSuccess(result);
    }
    catch(error) {
        res.sendServerError(error);
    }
    
};

export const getCartById = async (req, res) => {
    const cid = req.params.cid;

    try {
        const result = await CartService.getCartById(cid);
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
        const result = await CartService.updateCart(cid, req.body);
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
        const result = await CartService.deleteCart(cid);
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

        const result = await CartService.addProductToCart(cid, pid, quantity);
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
        const result = await CartService.addProductToCart(cid, pid);
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
        const result = await CartService.deleteProductFromCart(cid, pid);
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

export const purchaseCart = async (req, res, next) => {
    const cid = req.params.cid;
    const userEmail = req.user.email;

    try {
        if(!userEmail || !cid) {
            CustomError.createOrder({ email: userEmail, cid });
        }

        const result = await CartService.purchaseCart(cid, userEmail);
        return res.sendSuccess(result);
    }
    catch(error) {
        next(error);
    }
    
}
