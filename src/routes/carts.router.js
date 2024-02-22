import Router from "./router.js";
import { 
    addNewProductToCart, 
    addProductInCart, 
    createCart, 
    deleteCart, 
    deleteProductFromCart, 
    getCartById, 
    updateCart,
    purchaseCart 
} from "../controllers/cart.controller.js";

export default class CartRouter extends Router {
    init() {
        this.post("/", ["USER_ROLE", "PREMIUM_ROLE"], createCart);

        this.get("/:cid", ["USER_ROLE", "PREMIUM_ROLE"], getCartById);

        this.put("/:cid", ["USER_ROLE", "PREMIUM_ROLE"], updateCart);

        this.delete("/:cid", ["USER_ROLE", "PREMIUM_ROLE"], deleteCart);

        this.put("/:cid/products/:pid", ["USER_ROLE", "PREMIUM_ROLE"], addProductInCart);

        this.post("/:cid/products/:pid", ["USER_ROLE", "PREMIUM_ROLE"], addNewProductToCart);

        this.delete("/:cid/products/:pid", ["USER_ROLE", "PREMIUM_ROLE"], deleteProductFromCart);

        this.post("/:cid/purchase", ["USER_ROLE", "PREMIUM_ROLE"], purchaseCart)
    }
}