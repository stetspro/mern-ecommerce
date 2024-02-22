import { UserService, CartService } from "../repositories/index.js";
import { generateToken } from "../utils.js";
import { createHash } from "../utils.js";
import CurrentUserDTO from "../DTO/currentUser.dto.js";
import CustomError from "../utils/errors/custom.errors.js";
import { logger } from "../utils/logger.js";

export const registerUser = async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    try 
    {
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !password || !confirmPassword || !req.body.age) {
            CustomError.createUser(req.body);
        }

        if(req.body.age < 18 || req.body.age > 65) CustomError.createUser(req.body);

        if (password !== confirmPassword) CustomError.passwordsDontMatch();
    
        const passwordHashed = await createHash(password);
        
        const registerData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: passwordHashed,
            cart: await CartService.createCart()
        }

        const user = await UserService.registerUser(registerData); 

        if(user && user._id) {
            return res.sendSuccess(user);
        }
        
        return res.sendBadRequest('User couldnt be registered');
    }
    catch (error) 
    {
        next(error);
    }
    
};

export const loginUser = async (req, res, next) => {
    try 
    {
        if (!req.user) CustomError.login();

        const token = generateToken(req.user._doc, '24h');

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const user = new CurrentUserDTO(req.user._doc);

        return res.status(201).json(user);
    }
    catch (error) 
    {
        next(error);
    }
    
};

export const loginGithub = async (req, res) => {
    const token = generateToken(req.user._doc, '24h');

    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.redirect("/views/products");
}

export const logoutUser = async (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User logged out' });
};

export const getCurrentUser = async (req, res) => {
    if(!req.user) return res.status(401).json({ message: "Unauthorized" });
    
    let user = await UserService.getUserByEmail(req.user.email);
    user = new CurrentUserDTO(user);

    res.status(200).json(user);
}

export const updateUserRole = async (req, res) => {
    const { uid } = req.params;
    if(!uid) return res.sendBadRequest("User id is undefined or null");

    const role = await UserService.getUserRole(uid);

    if(role && role.role && role.role === 'ADMIN_ROLE') return res.sendBadRequest("Admin role can't be changed");

    let newRole = 'PREMIUM_ROLE';
    if(role && role.role && role.role === 'PREMIUM_ROLE') newRole = 'USER_ROLE';

    const result = await UserService.updateUser(uid, { role: newRole });
    res.sendSuccess(result);
}