import { logger } from "../utils/logger.js";


export default class TokenRepository {
    constructor(tokenDao, userDao, mailModule) {
        this.tokenDao = tokenDao;
        this.userDao = userDao;
    }

    createToken = async (userId, token) => {
        try {
            return await this.tokenDao.createToken(userId, token);        
        }
        catch (error) {
            logger.error('Error while creating reset password token: ' + error);
            throw error;
        }
    }

    getToken = async (userId, token) => {
        try {
            return await this.tokenDao.getToken(userId, token);        
        }
        catch (error) {
            logger.error('Error while getting reset password token: ' + error);
            throw error;
        }
    }

    deleteToken = async (tokenId) => {
        try {
            return await this.tokenDao.deleteToken(tokenId);
        }
        catch(error) {
            logger.error(error);
            throw error;
        }
    }

    resetUserPassword = async (userId, token, password) => {
        try {
            const result = await this.tokenDao.getToken(userId, token);

            if(result && result._id) {
                await this.userDao.updateUser(result.userId, { password });
                await this.tokenDao.deleteToken(result._id);
            }
            
        } catch (error) {
            logger.error('Error while getting reset password token: ' + error);
            throw error;
        }
    }
}
