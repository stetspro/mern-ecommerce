import { CartService, MessageService, ProductService } from '../repositories/index.js';

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    
    const data = await ProductService.getProducts(limit, page, sort, query, '/views/');

    return res.render('productList', { 
        products: data.payload, 
        totalPages: data.totalPages, 
        currentPage: data.page, 
        hasPrevPage: data.hasPrevPage, 
        hasNextPage: data.hasNextPage, 
        prevLink: data.prevLink, 
        nextLink: data.nextLink 
    });
};

export const getRealTimeProducts = async (req, res) => {
    const data = await ProductService.getProducts(40);

    return res.render('realTimeProducts', { products: data.payload });
};

export const getCartById = async (req, res) => {
    const data = await CartService.getCartById(req.params.cid);
    
    return res.render('cart', { cart: data });
};

export const getLoginView = async (req, res) => {
    return res.render('login');
};

export const getRegisterView = async (req, res) => {
    return res.render('register');
}

export const getHomeView = async (req, res) => {
    res.render('home');
};

export const getMessages = async (req, res) => {
    const messages = await MessageService.getAllMessages();
    res.render("chat", { messages });
};
