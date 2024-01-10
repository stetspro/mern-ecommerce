import { Router } from "express";
import { getHomeView, getLoginView, getProducts, getRealTimeProducts, getRegisterView, getCartById, getMessages } from "../dao/controllers/views.controller.js";
import { passportAuthorization } from "../utils.js";

const router = Router();

router.get("/", getHomeView);

router.get("/products", getProducts);

router.get("/realtimeproducts", passportAuthorization("jwt"), getRealTimeProducts);

router.get("/cart/:cid", passportAuthorization("jwt"), getCartById);

router.get("/login", passportAuthorization("jwt"), getLoginView);

router.get("/register", passportAuthorization("jwt"), getRegisterView);

router.get("/chat", getMessages)

router.get("*", (req, res) => res.status(404).send("404 - Not Found!"));

export default router;