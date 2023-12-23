import { ProductManager, ProductNotFoundError }  from '../services/product.service.js';
import { CartManager } from '../services/cart.service.js';
import { UserManager } from '../services/user.service.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const isAuth = req.session?.user ? true : false;
    
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
        username: req.session?.user ? req.session.user.first_name : '',
        cartId: req.session?.user ? req.session.user.cart : ''
    });
};

export const getRealTimeProducts = async (req, res) => {
    const data = await productManager.getProducts();

    return res.render('realTimeProducts', { products: data.payload });
};

export const getCartById = async (req, res) => {
    const data = await cartManager.getCartById(req.params.cid);
    
    return res.render('cart', { cart: data });
};

export const getLoginView = async (req, res) => {
    const isAuth = req.session.user ? true : false;
    if (isAuth) return res.redirect('/views/products');
    
    return res.render('login');
};

export const getRegisterView = async (req, res) => {
    const isAuth = req.session.user ? true : false;
    if (isAuth) return res.redirect('/views/products');

    return res.render('register');
}

export const getHomeView = async (req, res) => {
    res.render('home');
};
