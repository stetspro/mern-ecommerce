import fs from 'fs';

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
        this.path = 'productDB.json';
    }

    #isUniqueCode = async (code) => {
        const productsArray = await this.getProducts();
        return !productsArray.some(product => product.code === code);
    }

    #getNextID = async () => {
        const products = await this.getProducts();
        const count = products.length;
        if(count === 0) return 1;

        const position = count - 1;
        const lastProduct = products[position] ;

        return lastProduct.id + 1;
    }

    addProduct = async ({title, description, price, thumbnails, code, stock, status, category }) => {
        try {
            if(!title || !description || !price || !category || !code || !stock || !category) {
                throw new Error("You must fill all the required fields.");
            }
    
            const id = await this.#getNextID();
            const uniqueCode = await this.#isUniqueCode(code);
    
            if(!uniqueCode) {
                throw new Error("A product with that code already exists.");
            }
    
            const product = {
                id,
                title,
                description,
                price,
                thumbnails,
                code, 
                stock,
                status: status !== undefined ? status : true,
                category
            };
    
            const products = await this.getProducts();
            products.push(product);
    
            await fs.promises.writeFile(this.path, JSON.stringify(products));
    
            return id;
        }
        catch(error) {
            throw new Error('Error while adding a product: ' + error.message);
        }   
    }

    getProductById = async (id) => {
        let products = await this.getProducts();
        const product = products.find(p => p.id === id);

        if (product === undefined) {
            throw new ProductNotFoundError("Product with that ID not found");
        }
        
        return product;
    };

    getProducts = async () => {
        try {
            await this.#fileExist(this.path);

            let data = await fs.promises.readFile(this.path);
            data = JSON.parse(data);
            return data;
        }
        catch(error) {
            throw new FileError('Error while getting products: ' + error.message);
        };
    };

    updateProduct = async (id, obj) => {
        try {
            const products = await this.getProducts();
            let finded = false;
          
            const updatedProducts = products.map(product => {
              if (product.id === id) {
                finded = true;
    
                return {
                    ...product,
                    title: obj.title || product.title,
                    description: obj.description || product.description,
                    price: obj.price || product.price,
                    thumbnails: obj.thumbnails || product.thumbnails,
                    code: obj.code || product.code,
                    category: obj.category || product.title,
                    status: obj.status || product.status,
                    stock: obj.stock || product.stock
                };
              };
    
              return product;
            });
    
            if(!finded) {
                throw new ProductNotFoundError("Product with that ID not found");
            };
          
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
    
            return id;
        }
        catch(error) {
            throw new FileError('Error while updating product: ' + error.message);
        }
    }

    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();

            if(products?.length > 0){
                const productExists = products.find(product => product.id == id);

                if(productExists) {
                    const updatedProducts = products.filter(product => product.id !== id);
                    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));

                    return;
                } else {
                    throw new ProductNotFoundError("Product with that ID not found");
                }
                
            } else {
                throw new Error('There\'s no products to delete');
            };   
        }
        catch(error) {
            throw new FileError('Error deleting product: ' + error.message);
        };
    };

    #fileExist = async (path) => {
        try {
            const stats = fs.existsSync(path);
    
            if (stats == false) {
                await fs.promises.writeFile(path, "[]");
            };
        }
        catch(error) {
            throw new FileError('Error ensuring file existence: ' + error.message);
        };
    };
    
}