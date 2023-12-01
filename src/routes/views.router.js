import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../dao/services/product.service.js';
import { CartManager } from '../dao/services/cart.service.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    const data = await productManager.getProducts();
  
    return res.render('productList', { products: data.payload });
});

router.get("/realtimeproducts", async (req, res) => {
    const data = await productManager.getProducts();

    return res.render('realTimeProducts', { products: data.payload });
});

router.get("/carts/:cid", async (req, res) => {
    const data = await cartManager.getCartById(req.params.cid);
    console.log("cart", data);
    return res.render('cart', { cart: data });
});

export default router;