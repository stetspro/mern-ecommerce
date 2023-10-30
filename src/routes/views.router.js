import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../services/products.service.js';

const router = Router();
const productManager = new ProductManager();

router.get("/realtimeproducts", async (req, res) => {

});

export default router;