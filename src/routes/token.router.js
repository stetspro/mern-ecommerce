import Router from "./router.js";
import { 
    sendPasswordLink,
    resetPassword
} from "../controllers/token.controller.js";

export default class TokenRouter extends Router {
    init() {
        this.post("/", ["PUBLIC"], sendPasswordLink);
        this.post("/:userId/:token", ["PUBLIC"], resetPassword);
    }
}