import multer from 'multer';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import passport from 'passport';

const storage = multer.diskStorage({
    //Carpeta donde se guarda el archivo
    destination: function(req, file, cb) {
        cb(null, __dirname + '/public/img');
    },
    // Nombre con el que se guarda el archivo
    filename: function(req, file, cb) {
        cb(null, file.originalname);  // originalname: conserva el nombre inicial
    }
});

export const uploader = multer({ storage });

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const generateToken = (user) => {
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return token;
}

export const passportCall = (strategy, failureRedirect = "") => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false, failureRedirect }, function(err, user, info) {
            if (err) return next(err); 
            if (!user) { 
                return res.status(401).json({ error: info?.messages ? info?.messages : info?.toString() }); 
            }

            req.user = user;
            next();
           
        })(req, res, next);
    }
}

export const createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const compareHash = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
}