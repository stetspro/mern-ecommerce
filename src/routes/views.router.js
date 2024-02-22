import Router from "./router.js";
import { getHomeView, getLoginView, getProducts, getRealTimeProducts, getRegisterView, getCartById, getMessages, getResetPasswordView } from "../controllers/views.controller.js";

export default class ViewRouter extends Router {
    init() {
        this.get("/", ['PUBLIC'], getHomeView);
        this.get("/products", ['PUBLIC'], getProducts);
        this.get("/realtimeproducts", ['ADMIN_ROLE', 'PREMIUM_ROLE'], getRealTimeProducts);
        this.get("/cart/:cid", ['USER_ROLE', 'PREMIUM_ROLE'], getCartById);
        this.get("/login", ['PUBLIC'], getLoginView);
        this.get("/register", ['PUBLIC'], getRegisterView);
        this.get("/chat", ['USER_ROLE'], getMessages);
        this.get("/reset_password/:userId/:token", ['PUBLIC'], getResetPasswordView )
    }
}