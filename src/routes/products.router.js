import { Router } from "express";
import { 
    addProduct, 
    deleteProduct, 
    getProductById, 
    getProducts, 
    updateProduct 
} from "../dao/controllers/product.controller.js";

const router = Router();

router.get("/", getProducts);

router.get("/:pid", getProductById)

router.post("/", addProduct);

router.put("/:pid", updateProduct);

router.delete("/:pid", deleteProduct);

router.get("*", (req, res) => res.status(404).send("404 - Not Found!"));

export default router;