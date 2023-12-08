import { ProductManager, ProductNotFoundError }  from '../services/product.service.js';

const productManager = new ProductManager();

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}/api/`;

    const products = await productManager.getProducts(limit, page, sort, query, baseUrl);
    
    return res.json({ products });
};

export const getProductById = async (req, res) => {
    const pid = req.params.pid;

    try {
        const product = await productManager.getProductById(pid);
        return res.json({ product });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({error: "Internal server error: " + error.message });
        }
    }
    
};

export const addProduct = async (req, res) => {
    const data = req.body;

    try {
        const addProductRes = await productManager.addProduct(data);
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
        const updateProductRes = await productManager.updateProduct(pid, data);
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
        const deleteProductRes = await productManager.deleteProduct(pid);
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