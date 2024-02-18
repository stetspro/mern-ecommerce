import { UserService, TokenService } from "../repositories/index.js";
import Mail from "../modules/mail.module.js";
import { compareAsync, generateToken, verifyToken } from "../utils.js";
import { createHash } from "../utils.js";
import { logger } from "../utils/logger.js";
import config from "../config/config.js";

const mailModule = new Mail();

export const sendPasswordLink = async (req, res) => {
    try {
        if(!req.body.email) return res.status(400).json({ message: "Email is required"});

        const user = await UserService.getUserByEmail(req.body.email);

        if(user && user._id) {
            const token = generateToken(user, '1h');
            const result = await TokenService.createToken(user._id, token);
    
            if(result && result._id) {
                const link = config.baseUrl + 'views/reset_password/' + result.userId + "/" + result.token;
    
                await mailModule.sendResetPasswordMail(user, link);
                logger.debug("[Reset Password Link]: " + link);
                res.sendSuccess({ message: "Reset password e-mail sent."});
            }
    
        }
    }
    catch (error) {
        logger.error(err);
        throw error;
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { userId, token } = req.params;
        const { newPassword } = req.body;

        const result = await TokenService.getToken(userId, token);

        if(result && result._id && result.token) {
            const tokenDecode = await verifyToken(result.token);

            if(tokenDecode && tokenDecode.hash) {
                const validatePassword = await compareAsync(newPassword, tokenDecode.hash);

                if(validatePassword) {
                    return res.sendBadRequest("The password provided is invalid. Please choose a password that is different from your previous one.");

                }

                const passwordHashed = await createHash(newPassword);
                await UserService.updateUser(result.userId, { password: passwordHashed });
                await TokenService.deleteToken(result._id);

                return res.sendSuccess({ message: "Pasword has been restored successfully."});
            }

            return res.sendBadRequest("Invalid token or expired.");
        }

        return res.sendBadRequest("Invalid token or expired.");
    }
    catch (err) {
        logger.error("[resetPassword]: " + err);
        throw err;
    }
}