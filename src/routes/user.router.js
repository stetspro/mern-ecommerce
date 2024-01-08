import { Router } from "express";
import { 
    getCurrentUser,
    loginUser, 
    logoutUser, 
    registerUser 
} from "../dao/controllers/user.controller.js";
import passport from "passport";
import { generateToken } from "../utils.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", passport.authenticate('login', { failureRedirect: '/views/login', session: false }), loginUser);

router.post("/logout", logoutUser);

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }), async (req, res) => {});

router.get("/callbackgithub", passport.authenticate("github", { failureRedirect: "/views/login", session: false }), async (req, res) => {
    const token = generateToken(req.user._doc);

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.redirect("/views/products");
});

router.get("/current", passport.authenticate("jwt", { session: false }), getCurrentUser);

export default router;