import { logger } from "../utils/logger.js";

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUserByEmail = async (email) => {
        try {
            return await this.dao.getUserByEmail(email);
        }
        catch (error) {
            logger.error('Error while getting user by email: ' + error);
            throw error;
        }
    }

    getUserById = async (id) => {
        try {
            return await this.dao.getUserById(id);
        }
        catch (error) {
            logger.error('Error while getting user by id: ' + error);
            throw error;
        }
    }
    
    registerUser = async (user) => {
        try {
            return await this.dao.createUser(user);
        }
        catch (error) {
            logger.error('Error while registering user: ' + error);
            throw error;
        }
    }
}
