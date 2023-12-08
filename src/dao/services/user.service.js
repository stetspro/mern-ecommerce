import { userModel } from "../models/user.model.js";

export class UserManager {
    constructor() {
        this.userModel = new userModel();
    }

    getUserByEmail = async (email) => {
        try {
            return await userModel.findOne({ email });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    registerUser = async (user) => {
        try {
            return await userModel.create({ ...user });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
}
