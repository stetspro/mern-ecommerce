import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../dao/services/product.service.js';
import { CartManager } from '../dao/services/cart.service.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    res.render('home');
});

router.get("/products", async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const data = await productManager.getProducts(limit, page, sort, query, '/views/');

    return res.render('productList', { 
        products: data.payload, 
        totalPages: data.totalPages, 
        currentPage: data.page, 
        hasPrevPage: data.hasPrevPage, 
        hasNextPage: data.hasNextPage, 
        prevLink: data.prevLink, 
        nextLink: data.nextLink 
    });
});

router.get("/realtimeproducts", async (req, res) => {
    const data = await productManager.getProducts();

    return res.render('realTimeProducts', { products: data.payload });
});

router.get("/carts/:cid", async (req, res) => {
    const data = await cartManager.getCartById(req.params.cid);
    
    return res.render('cart', { cart: data });
});

export default router;