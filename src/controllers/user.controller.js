import { UserService, CartService } from "../services/index.js";
import { generateToken } from "../utils.js";
import { createHash } from "../app.js";

export const registerUser = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    
    try 
    {
        const passwordHashed = await createHash(password);
        
        const registerData = {
            first_name: req.body.name,
            last_name: req.body.lastName,
            email: req.body.email,
            password: passwordHashed,
            cart: await CartService.createCart()
        }

        const user = await UserService.registerUser(registerData); 
      
        if(user) return res.sendSuccess(user);
        
        return res.sendUserError('User couldnt be registered');
    }
    catch (error) 
    {
        console.log("Error: ", error)
        return res.sendServerError(error);
    }
    
};

export const loginUser = async (req, res) => {
    try 
    {
        if (!req.user) return res.status(401).json({ error: 'Invalid credentials' });

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
        return res.status(500).json({ error: error.message });
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
    
    const { cart, role, first_name, email } = await UserService.getUserByEmail(req.user.email);

    const user = {
        cart,
        role,
        first_name,
        email
    }

    res.status(200).json(user);
}