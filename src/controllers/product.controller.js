import { ProductService } from '../services/index.js';
import CustomError from '../utils/errors/custom.errors.js';

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}/api/`;

    const products = await ProductService.getProducts(limit, page, sort, query, baseUrl);
    
    return res.sendSuccess(products);
};

export const getProductById = async (req, res) => {
    const pid = req.params.pid;

    try {
        const product = await ProductService.getProductById(pid);
        return res.sendSuccess(product);
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.sendNotFound(error.message);
        } else {
            res.sendServerError(error);
        }
    }
    
};

export const addProduct = async (req, res, next) => {
    const data = req.body;

    try {
        if(!data.title || !data.price || !data.stock || !data.thumbnail || !data.code || !data.description || !data.category) {
            CustomError.createProduct(data);
        }

        const addProductRes = await ProductService.addProduct(data);
        return res.json({ productId: addProductRes });
    }
    catch(error) {
        next(error);
    }
};

export const updateProduct = async (req, res) => {
    const pid = req.params.pid;
    const data = req.body;

    try {
        const updateProductRes = await ProductService.updateProduct(pid, data);
        return res.json({ productId: updateProductRes });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({error: "Internal server error: " + error.message });
        }
    }
   
};

export const deleteProduct = async (req, res, next) => {
    const pid = req.params.pid;
    
    try {
        if(!pid) {
            CustomError.deleteProduct();
        }

        const deleteProductRes = await ProductService.deleteProduct(pid);
        return res.json({ productId: deleteProductRes });
    }
    catch(error) {
        next(error);
    }
};