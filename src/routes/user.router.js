import Router from "./router.js";
import { 
    getCurrentUser,
    loginGithub,
    loginUser, 
    logoutUser, 
    registerUser 
} from "../controllers/user.controller.js";
import passport from "passport";

export default class UserRouter extends Router {
    init() {
        this.post("/register", ["PUBLIC"], registerUser);
        this.post("/login", ["PUBLIC"], passport.authenticate('login', { session: false }), loginUser);
        this.post("/logout", ["USER_ROLE", "ADMIN_ROLE"], logoutUser);
        this.get("/github", ["PUBLIC"], passport.authenticate("github", { scope: ["user:email"], session: false }), async (req, res) => {});
        this.get("/callbackgithub", ["PUBLIC"], passport.authenticate("github", { session: false }), loginGithub);
        this.get("/current", ["USER_ROLE", "ADMIN_ROLE"], getCurrentUser);
    }
}