import multer from 'multer';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import passport from 'passport';
import bcrypt from 'bcrypt';

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
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export const generateToken = (user, expires) => {
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, hash: user.password },
        process.env.JWT_SECRET,
        { expiresIn: expires }
    );

    return token;
}

export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}

export const passportCall = (strategy, roles = []) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function(err, user, info) {
            if (err) return next(err); 
            if (!user) { 
                return res.status(401).json({ error: info?.messages ? info?.messages : info?.toString() }); 
            }

            if (roles.length && !roles.includes(user.role)) {
                return res.sendNoAuthorizedError();
            }

            req.user = user;
            next();
           
        })(req, res, next);
    }
}

export const createHash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const compareAsync = (password, hash) => {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, hash, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}