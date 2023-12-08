import { UserManager } from "../services/user.service.js";

const userManager = new UserManager();

export const registerUser = async (req, res) => {
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });
    
    try 
    {
        const user = await userManager.registerUser(req.body); 
      
        if(user) return res.status(201).json({ user: user.email });
        
        return res.status(400).json({ error: 'User could not be created' });
    }
    catch (error) 
    {
        return res.status(500).json({ error: error.message });
    }
    
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try 
    {
        const user = await userManager.getUserByEmail(email); 

        if (user && user.password === password) 
        {
            const userName = `${user.name} ${user.lastName}`;
            req.session.user = { id: user._id, name: userName, email: user.email };
            req.session.role = user.role;

            console.log(req.session, "from login")

            return res.status(201).json({ user });
        } 
        
        return res.status(400).json({ error: 'Invalid credentials' });
        
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