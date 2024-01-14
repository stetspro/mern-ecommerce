import Router from "./router.js";
import { 
    addNewProductToCart, 
    addProductInCart, 
    createCart, 
    deleteCart, 
    deleteProductFromCart, 
    getCartById, 
    updateCart 
} from "../dao/controllers/cart.controller.js";

export default class CartRouter extends Router {
    init() {
        this.post("/", ["USER_ROLE", "ADMIN_ROLE"], createCart);

        this.get("/:cid", ["USER_ROLE", "ADMIN_ROLE"], getCartById);

        this.put("/:cid", ["USER_ROLE", "ADMIN_ROLE"], updateCart);

        this.delete("/:cid", ["USER_ROLE", "ADMIN_ROLE"], deleteCart);

        this.put("/:cid/products/:pid", ["USER_ROLE", "ADMIN_ROLE"], addProductInCart);

        this.post("/:cid/products/:pid", ["USER_ROLE", "ADMIN_ROLE"], addNewProductToCart);

        this.delete("/:cid/products/:pid", ["USER_ROLE", "ADMIN_ROLE"], deleteProductFromCart);
    }
}