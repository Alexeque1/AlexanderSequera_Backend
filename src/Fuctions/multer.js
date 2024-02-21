import multer from "multer";
import fs from "fs";
import path from "path"; // Importa el módulo path

import __dirname from "../app.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
      if (file.fieldname === 'profileImage') {
        uploadPath = 'public/profiles';
      } else if (file.fieldname === 'productImage') {
        uploadPath = 'public/products';
      } else if (file.fieldname === 'documents'){
        uploadPath = 'public/documents';
      }

      const fullPath = path.join(__dirname, uploadPath); // Une las partes de la ruta con el separador adecuado
      fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
export const upload = multer({ storage });

