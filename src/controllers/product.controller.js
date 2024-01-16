import { ProductService } from '../services/index.js';

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

export const addProduct = async (req, res) => {
    const data = req.body;

    try {
        const addProductRes = await ProductService.addProduct(data);
        return res.json({ productId: addProductRes });
    }
    catch(error) {
        res.status(500).json({ error: "Internal server error: " + error.message });
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

export const deleteProduct = async (req, res) => {
    const pid = req.params.pid;
    
    try {
        const deleteProductRes = await ProductService.deleteProduct(pid);
        return res.json({ productId: deleteProductRes });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal server error: " + error.message });
        }
    }
};