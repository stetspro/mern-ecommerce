import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser 
} from "../dao/controllers/user.controller.js";
import passport from "passport";

const router = Router();

router.post("/register", registerUser);

router.post("/login", passport.authenticate('login', { failureRedirect: '/views/login' }), loginUser);

router.post("/logout", logoutUser);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/callbackgithub", passport.authenticate("github", { failureRedirect: "/views/login" }), async (req, res) => {
    console.log(req.user);

    req.session.user = { id: req.user._id, name: req.user.name, lastName: req.user.lastName, email: req.user.email, role: req.user.role };

    res.redirect("/views/products");
});

export default router;