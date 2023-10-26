import { Router } from "express";
import { ProductManager, ProductNotFoundError }  from '../services/products.service.js';

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    
    if(limit) {
        const productsLimited = products.slice(0, limit);
        return res.send({ products: productsLimited });
    }

    return res.send({ products });
});

router.get("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);

    try {
        const product = await productManager.getProductById(pid);
        return res.send({ product });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({error: "Internal server error: " + error.message });
        }
    }
    
})

router.post("/", async (req, res) => {
    const data = req.body;

    try {
        const addProductRes = await productManager.addProduct(data);
        return res.send({ productId: addProductRes });
    }
    catch(error) {
        res.status(500).send({ error: "Internal server error: " + error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const data = req.body;

    try {
        const updateProductRes = await productManager.updateProduct(pid, data);
        return res.send({ productId: updateProductRes });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({error: "Internal server error: " + error.message });
        }
    }
   
});

router.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    try {
        const deleteProductRes = await productManager.deleteProduct(pid);
        return res.send({ productId: deleteProductRes });
    }
    catch(error) {
        if (error instanceof ProductNotFoundError) {
            res.status(404).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Internal server error: " + error.message });
        }
    }
});


export default router;