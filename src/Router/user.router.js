import { Router } from "express";
import { userController } from "../Controllers/userController.js";
import { upload } from "../Fuctions/multer.js";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await userController.findUserById(id);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado.');
          }

          res.json({ message: `El usuario ${usuario.first_name} se ha obtenido con exito.`, payload: usuario });
    } catch (error) {
        logger.error(`Error en la ruta /getUserName: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.post('/:id/profileImage', upload.single('profileImage'), async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.file) {
            return res.status(500).json({ status: "error", message: "No se ha podido subir el archivo" });
        }

        const usuario = await userController.findUserById(id);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado.');
        }

        // Verificar si el usuario ya tiene un documento de imagen de perfil
        const existingDocumentIndex = usuario.documents.findIndex(doc => doc.name === 'profileImage');
        const imagePath = "/profiles/" + req.file.originalname

        if (existingDocumentIndex !== -1) {
            usuario.documents[existingDocumentIndex].document = imagePath;
        } else {
            usuario.documents.push({
                name: 'profileImage',
                document: imagePath
            });
        }

        await usuario.save();

        return res.status(200).json({ status: "success", message: "Se ha subido el archivo correctamente", imageUrl: imagePath });
    } catch (error) {
        logger.error(`Error en la ruta /getUserName: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.post('/:id/documents', upload.single('documents'), async (req, res) => {
    const { id } = req.params;
    const { documentType } = req.body

    try {
        if (!req.file) {
            return res.status(500).json({ status: "error", message: "No se ha podido subir el archivo" });
        }

        const usuario = await userController.findUserById(id);

        if (!usuario) {
            return res.status(404).send({status: "error", message: "Usuario no encontrado"});
        }

        const existingDocumentIndex = usuario.documents.findIndex(doc => doc.name === documentType);

        if (existingDocumentIndex !== -1) {
            usuario.documents[existingDocumentIndex].document = "/documents/" + req.file.originalname;
        } else {
            usuario.documents.push({
                name: documentType,
                document: "/documents/" + req.file.originalname
            });
        }

        await usuario.save();

        return res.status(200).json({ status: "success", message: "Se ha subido el archivo correctamente"});
    } catch (error) {
        logger.error(`Error en la ruta /getUserName: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.put('/premium/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const usuario = await userController.findUserById(id);
  
      if (!usuario) {
        return res.status(404).send({status: "error", message: 'Usuario no encontrado.'});
      }

      if (usuario.role === "PREMIUM") {
        return res.status(400).send({status: "error", message: 'El usuario ya es premium.'});
      }
  
        const requiredDocuments = ['identificacion', 'comprobanteDomicilio', 'comprobanteEstadoCuenta'];
        const documentsUploaded = usuario.documents.map(doc => doc.name);
        const allDocumentsUploaded = requiredDocuments.every(doc => documentsUploaded.includes(doc));
        
        if (!allDocumentsUploaded) {
            return res.status(400).send({status: "error", message: 'El usuario debe cargar los documentos requeridos antes de convertirse en premium.'});
        }
      
        usuario.role = 'PREMIUM';
        await usuario.save();
  
      res.json({ status: "success", message: `Rol del usuario "${usuario.first_name}" se actualizado a ${usuario.role}.` });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cambiar el rol del usuario.');
    }
  });

export default router;
