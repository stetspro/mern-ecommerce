import multer from 'multer';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return token;
}

export const authorization = role => {

    return async (req, res, next) => {
      const user = req.user
  
      if (!user) return res.status(401).send({ error: 'Unauthorized' })
      if( user.user.role != role ) return res.status(403).send({error: 'No permisions'})

      console.log("user", user)
  
      return next()
    }
  
}