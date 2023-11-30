import { Router } from "express";
import { CartManager, CartNotFoundError } from "../dao/services/cart.service.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const result = await cartManager.createCart(data);
        return res.status(200).json({ result });
    }
    catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
});

router.get("/:cid", async (req, res) => {
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
});

router.put("/:cid", async (req, res) => {
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
});

router.delete("/:cid", async (req, res) => {
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
});

router.put("/:cid/products/:pid", async (req, res) => {
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
});

router.post("/:cid/products/:pid", async (req, res) => {
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
});

router.delete("/:cid/products/:pid", async (req, res) => {
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
});

export default router;