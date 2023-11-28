import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../dao/services/product.service.js';

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const data = await productManager.getProducts();
  
    return res.render('productList', { products: data.payload });
});

router.get("/realtimeproducts", async (req, res) => {
    const data = await productManager.getProducts();

    return res.render('realTimeProducts', { products: data.payload });
});

export default router;