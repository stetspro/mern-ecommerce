import { Router } from "express";
import { CartManager, CartNotFoundError } from "../services/carts.service.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
    const data = req.body;
    try {
        const createCartRes = await cartManager.createCart(data);
        return res.send({ cartId: createCartRes });
    }
    catch(error) {
        res.status(500).send({ error: "Internal server error" });
    }
    
});

router.get("/:cid", async (req, res) => {
    const cid = parseInt(req.params.cid);

    try {
        const getCartProductsRes = await cartManager.getCartProducts(cid);
        return res.send({ products: getCartProductsRes });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Internal server error" });
        }
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    try {
        const addProductsRes = await cartManager.addProductsToCart(cid, pid);
        return res.send({ cart: addProductsRes });
    }
    catch(error) {
        if (error instanceof CartNotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Internal server error" });
        }
    }
});

export default router;