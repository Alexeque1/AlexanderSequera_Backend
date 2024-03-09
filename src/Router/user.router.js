import { Router } from "express";
import { userController } from "../Controllers/userController.js";
import { upload } from "../Fuctions/multer.js";
import { logger } from "../Fuctions/logger.js";
import userDTOAPI from "../DTO/userDTOapi.js";
import { authorizeAdmin } from "../middlewares/Authorize.middleware.js";
import { transport } from "../app.js";

const router = Router();

// GET  /  deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)
router.get('/', async (req, res) => {
    try {
        const usuarios = await userController.getUserInfo()
        let usuariosDTO = []

        for (let i = 0; i < usuarios.length; i++) {
            const userDTO = new userDTOAPI(usuarios[i])
            usuariosDTO.push(userDTO)          
        }

        res.status(200).json({ message: `Usuarios obtenidos con exito.`, payload: usuariosDTO });
    } catch (error) {
        logger.error(`Error en la ruta /getUserName: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await userController.findUserById(id);

        if (!usuario) {
            return res.status(404).send('Usuario no encontrado.');
          }

          res.json({ message: `El usuario ${usuario.first_name} se ha obtenido con exito.`, payload: usuario });
    } catch (error) {
        logger.error(`Error en la ruta /api/user/:id ${error.message}`);
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
        logger.error(`Error en la ruta /api/user/:id/profileImage: ${error.message}`);
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
        logger.error(`Error en la ruta /api/user/:id/documents: ${error.message}`);
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

  router.put('/changerole/:id', async (req, res) => {
    const { id } = req.params;
    const { selectedRole } = req.body;
  
    try {
      const usuario = await userController.findUserById(id);
  
      if (!usuario) {
        return res.status(404).send({status: "error", message: 'Usuario no encontrado.'});
      }

        usuario.role = selectedRole;
        await usuario.save();
  
      res.json({ status: "success", message: `Rol del usuario "${usuario.first_name}" se actualizado a ${usuario.role}.` });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cambiar el rol del usuario.');
    }
  });

  router.delete('/remove/:id', authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const userRemoved = await userController.removeUser(id)
        logger.info(`El usuario con el ${id} fue eliminado exitosamente`);

        return res.json({ payload: userRemoved, status: "success", message: `El usuario fue eliminado exitosamente`});

    } catch (error) {
        res.status(500).send('Error en el router al eliminar al usuario.');
    }
  });

  router.delete('/cleanInactiveUsers', async (req, res) => {
    try {
        const inactiveUsers = await userController.inactiveUsers();

        inactiveUsers.forEach(async (user) => {
            let mailOptions = {
                from: 'AlexBackend <alexandersequera97@gmail.com>',
                to: user.email,
                subject: "Restaurar contraseña",
                html: `
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: 'Arial', sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    margin: 0; 
                                    padding: 0; 
                                }
                                header {
                                    background-color: #007bff;
                                    padding: 20px;
                                    color: #fff;
                                    text-align: center;
                                    width: 100%; 
                                }
                                main {
                                    max-width: 600px; 
                                    margin: 20px auto; 
                                }
                                button {
                                    background-color: rgb(191, 184, 184);
                                    padding: 10px;
                                    font-family: 'Saira Stencil One', cursive;
                                    font-size: 1em;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    text-align: center;
                                    display: block; 
                                    margin: 10px auto; 
                                }
                                footer {
                                    background-color: #f4f4f4;
                                    padding: 10px;
                                    text-align: center;
                                    font-size: 12px;
                                    width: 100%; 
                                }
                            </style>
                        </head>
                        <body>
                            <header>
                                <h1>Funko Pop - Eliminación de la cuenta</h1>
                            </header>
                            <main>
                                <p>¡Hola, <b>${user.first_name}<b>!</p>
                                <p>Hemos detectado que no te conectas desde hace 2 días, por lo que hemos decido eliminar tu cuenta.</p>
                                <p>Gracias por utilizar nuestros servicios.</p>
                            </main>
                            <footer>
                                <p>Este es un mensaje automático. Por favor, no responda a este correo electrónico.</p>
                                <p>&copy; 2024 Funko Pop Argentina</p>
                            </footer>
                        </body>
                    </html>
                `
            };
            
            await transport.sendMail(mailOptions);
        });

        res.status(200).json('Usuarios inactivos eliminados y correos electrónicos enviados con éxito.');
    } catch (error) {
        console.error('Error al limpiar usuarios inactivos:', error);
        res.status(500).send('Error al limpiar usuarios inactivos.');
    }
});

export default router;
