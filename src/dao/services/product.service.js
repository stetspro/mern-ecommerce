import { productModel } from '../models/product.model.js';

export class ProductNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ProductNotFoundError";
    }
}

export class FileError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileError";
    }
}

export class ProductManager {
    constructor() {
        this.productModel = new productModel();
    }

    #isUniqueCode = async (code) => {
        const productsArray = await this.getProducts();
        return !productsArray.some(product => product.code === code);
    }

    addProduct = async ({title, description, price, thumbnail, code, stock, status, category }) => {
        try {
            if(!title || !description || !price || !category || !code || !stock || !category || !thumbnail) {
                throw new Error("You must fill all the required fields.");
            }
    
            const uniqueCode = await this.#isUniqueCode(code);
    
            if(!uniqueCode) {
                throw new Error("A product with that code already exists.");
            }
    
            const product = {
                title,
                description,
                price,
                thumbnail,
                code, 
                stock,
                status: status !== undefined ? status : true,
                category
            };
    
            const res = await productModel.create(product);

            return res._id;
        }
        catch(error) {
            throw new Error('Error while adding a product: ' + error.message);
        }   
    }

    getProductById = async (id) => {
        const product = await productModel.findById(id).lean();

        if (!product) {
            throw new ProductNotFoundError("Product with that ID not found");
        }
        
        return product;
    };

    getProducts = async () => {
        try {
            const products = await productModel.find({}).lean();
            return products;
        }
        catch(error) {
            throw new FileError('Error while getting products: ' + error.message);
        };
    };

    updateProduct = async (id, obj) => {
        try {
            const res = await  productModel.findByIdAndUpdate(id, obj, { new: true }).lean();
            return res._id;
        }
        catch (err) {
            throw new Error('Error while updating product: ' + err.message);
        }
    }

    deleteProduct = async (id) => {
        try {
            const res = await productModel.findByIdAndDelete(id).lean();
            
            return res._id;
        }
        catch (err) {
            throw new Error('Error while deleting product: ' + err.message);
        }
        
    };   
}