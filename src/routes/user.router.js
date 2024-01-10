import { Router } from "express";
import { 
    getCurrentUser,
    loginGithub,
    loginUser, 
    logoutUser, 
    registerUser 
} from "../dao/controllers/user.controller.js";
import passport from "passport";
import { generateToken, passportCall } from "../utils.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", passport.authenticate('login', { failureRedirect: '/views/login', session: false }), loginUser);

router.post("/logout", logoutUser);

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }), async (req, res) => {});

router.get("/callbackgithub", passport.authenticate("github", { failureRedirect: "/views/login", session: false }), loginGithub);

router.get("/current", passportCall("jwt"), getCurrentUser);

router.get("*", (req, res) => res.status(404).send("404 - Not Found!"));

export default router;