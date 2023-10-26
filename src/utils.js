import multer from 'multer';

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