import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../services/products.service.js';

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    return res.render('home', { products });
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    return res.render('realTimeProducts', { products });
});

export default router;