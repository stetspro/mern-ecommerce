import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { getHomeView, getLoginView, getProducts, getRealTimeProducts, getRegisterView, getCartById } from "../dao/controllers/views.controller.js";

const router = Router();

router.get("/", getHomeView);

router.get("/products", getProducts);

router.get("/realtimeproducts", authMiddleware, adminMiddleware, getRealTimeProducts);

router.get("/carts/:cid", authMiddleware, getCartById);

router.get("/login", getLoginView);

router.get("/register", getRegisterView);

export default router;