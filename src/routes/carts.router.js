import { Router } from "express";
import { CartManager, CartNotFoundError } from "../dao/services/cart.fs.service.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const createCartRes = await cartManager.createCart(data);
        return res.json({ cartId: createCartRes });
    }
    catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
    
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        const getCartProductsRes = await cartManager.getCartProducts(cid);
        return res.json({ products: getCartProductsRes });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    try {
        const addProductsRes = await cartManager.addProductsToCart(cid, pid);
        return res.json({ cart: addProductsRes });
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