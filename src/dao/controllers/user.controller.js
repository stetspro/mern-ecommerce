import { compareHash, createHash } from "../../app.js";
import { UserManager } from "../services/user.service.js";
import { CartManager } from "../services/cart.service.js";

const userManager = new UserManager();
const cartManager = new CartManager();

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
            cart: await cartManager.createCart()
        }

        const user = await userManager.registerUser(registerData); 
      
        if(user) return res.status(201).json({ user: user.email });
        
        return res.status(400).json({ error: 'User could not be created' });
    }
    catch (error) 
    {
        return res.status(500).json({ error: error.message });
    }
    
};

export const loginUser = async (req, res) => {
    try 
    {
        if (!req.user) return res.status(400).json({ error: 'Invalid credentials' });

        const { password, ...user } = req.user._doc;

        req.session.user = { ...user };

        return res.status(201).json({ user: req.user.email });
    }
    catch (error) 
    {
        return res.status(500).json({ error: error.message });
    }
    
};

export const logoutUser = async (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'User logged out' });
};