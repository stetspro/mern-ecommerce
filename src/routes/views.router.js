import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import { getHomeView, getLoginView, getProducts, getRealTimeProducts, getRegisterView, getCartById, getMessages } from "../dao/controllers/views.controller.js";

const router = Router();

router.get("/", getHomeView);

router.get("/products", getProducts);

router.get("/realtimeproducts", getRealTimeProducts);

router.get("/cart/:cid", getCartById);

router.get("/login", getLoginView);

router.get("/register", getRegisterView);

router.get("/chat", getMessages)

export default router;