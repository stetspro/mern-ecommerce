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
        const product = await productModel.find({ code });
        return product.length === 0;
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

    getProducts = async (limit = 10, page = 1, sort, query = {}, baseUrl) => {
        try {
            const options = { limit, page, lean: true };

            if (sort == 'asc') {
                options.sort = { price: 1 };
            } else if (sort == 'desc') {
                options.sort = { price: -1 };
            }
            
            const data = await productModel.paginate(query, options);
            
            const response = {
                status: 'success',
                payload: data.docs,
                totalPages: data.totalPages,
                page: data.page,
                prevPage: data.prevPage,
                nextPage: data.nextPage,
                hasPrevPage: data.hasPrevPage,
                hasNextPage: data.hasNextPage,
                prevLink: data.hasPrevPage ? `${baseUrl}/api/products?limit=${limit}&page=${data.prevPage}` : null,
                nextLink: data.hasNextPage ? `${baseUrl}/api/products?limit=${limit}&page=${data.nextPage}` : null
            }
            
            return response;
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