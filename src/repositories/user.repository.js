import { logger } from "../utils/logger.js";

export default class UserRepository {
    constructor(userDao, mailModule) {
        this.userDao = userDao;
        this.mailModule = mailModule;
    }

    getUserByEmail = async (email) => {
        try {
            return await this.userDao.getUserByEmail(email);
        }
        catch (error) {
            logger.error('Error while getting user by email: ' + error);
            throw error;
        }
    }

    getUserById = async (id) => {
        try {
            return await this.userDao.getUserById(id);
        }
        catch (error) {
            logger.error('Error while getting user by id: ' + error);
            throw error;
        }
    }
    
    registerUser = async (user) => {
        try {
            const response = await this.userDao.createUser(user);

            if(response && response._id) {
                this.mailModule.sendNewUserMail(response);
            }

            return response;
        }
        catch (error) {
            logger.error('Error while registering user: ' + error);
            throw error;
        }
    }
}
