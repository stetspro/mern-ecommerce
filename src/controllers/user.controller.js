import { UserService, CartService } from "../services/index.js";
import { generateToken } from "../utils.js";
import { createHash } from "../utils.js";
import nodemailer from "../config/nodemailer.config.js";
import twilio from "../config/twilio.config.js";
import CurrentUserDTO from "../DTO/currentUser.dto.js";
import CustomError from "../utils/errors/custom.errors.js";

export const registerUser = async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    try 
    {
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !password || !confirmPassword) {
            CustomError.createUser(req.body);
        }

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

        nodemailer.sendNewUserMail(user);
        twilio.sendSMS();

        if(user) return res.sendSuccess(user);
        
        return res.sendUserError('User couldnt be registered');
    }
    catch (error) 
    {
        next(error);
    }
    
};

export const loginUser = async (req, res) => {
    try 
    {
        if (!req.user) CustomError.login();

        const token = generateToken(req.user._doc);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const { cart, role, first_name, email } = req.user._doc;

        const user = {
            cart,
            role,
            first_name,
            email
        }

        return res.status(201).json(user);
    }
    catch (error) 
    {
        next(error);
    }
    
};

export const loginGithub = async (req, res) => {
    const token = generateToken(req.user._doc);

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