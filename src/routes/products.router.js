import Router from "./router.js";
import { 
    addProduct, 
    deleteProduct, 
    getProductById, 
    getProducts, 
    updateProduct 
} from "../controllers/product.controller.js";

export default class ProductRouter extends Router {
    init() {
        this.get("/", ['PUBLIC'], getProducts);
        this.get("/:pid", ['PUBLIC'], getProductById);
        this.post("/", ['ADMIN_ROLE'], addProduct);
        this.put("/:pid", ['ADMIN_ROLE'], updateProduct);
        this.delete("/:pid", ['ADMIN_ROLE'], deleteProduct);
    }
}