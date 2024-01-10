import { ProductManager, ProductNotFoundError }  from '../services/product.service.js';
import { CartManager } from '../services/cart.service.js';
import { UserManager } from '../services/user.service.js';
import { MessageManager } from "../services/message.service.js";

const messageManager = new MessageManager();
const productManager = new ProductManager();
const cartManager = new CartManager();

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const isAuth = res.locals.user ? true : false;
    
    const data = await productManager.getProducts(limit, page, sort, query, '/views/');

    return res.render('productList', { 
        products: data.payload, 
        totalPages: data.totalPages, 
        currentPage: data.page, 
        hasPrevPage: data.hasPrevPage, 
        hasNextPage: data.hasNextPage, 
        prevLink: data.prevLink, 
        nextLink: data.nextLink ,
        isAuth: isAuth,
        username: res.locals.user ? res.locals.user.first_name : '',
        cartId: res.locals.user ? res.locals.user.cart : ''
    });
};

export const getRealTimeProducts = async (req, res) => {
    if(!req.isAuth) return res.redirect('/views/login');
    if(req.role !== 'ADMIN_ROLE') return res.redirect('/views/products');

    const data = await productManager.getProducts();

    return res.render('realTimeProducts', { products: data.payload });
};

export const getCartById = async (req, res) => {
    if (!req.isAuth) return res.redirect('/views/login');

    const data = await cartManager.getCartById(req.params.cid);
    
    return res.render('cart', { cart: data });
};

export const getLoginView = async (req, res) => {
    if (req.isAuth) return res.redirect('/views/products');
    
    return res.render('login');
};

export const getRegisterView = async (req, res) => {
    if (req.isAuth) return res.redirect('/views/products');

    return res.render('register');
}

export const getHomeView = async (req, res) => {
    res.render('home');
};

export const getMessages = async (req, res) => {
    const messages = await messageManager.getAllMessages();
    res.render("chat", { messages });
};
