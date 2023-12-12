import { compareHash, createHash } from "../../app.js";
import { UserManager } from "../services/user.service.js";

const userManager = new UserManager();

export const registerUser = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    
    try 
    {
        const passwordHashed = await createHash(password);
        const user = await userManager.registerUser({...req.body, password: passwordHashed}); 
      
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

        const userName = `${req.user.name} ${req.user.lastName}`;
        req.session.user = { id: req.user._id, name: userName, email: req.user.email, role: req.user.role };

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