import { Router } from "express";
import { 
    addNewProductToCart, 
    addProductInCart, 
    createCart, 
    deleteCart, 
    deleteProductFromCart, 
    getCartById, 
    updateCart 
} from "../dao/controllers/cart.controller.js";

const router = Router();

router.post("/", createCart);

router.get("/:cid", getCartById);

router.put("/:cid", updateCart);

router.delete("/:cid", deleteCart);

router.put("/:cid/products/:pid", addProductInCart);

router.post("/:cid/products/:pid", addNewProductToCart);

router.delete("/:cid/products/:pid", deleteProductFromCart);

router.get("*", (req, res) => res.status(404).send("404 - Not Found!"));

export default router;