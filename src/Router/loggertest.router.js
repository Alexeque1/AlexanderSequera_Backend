import { Router } from "express";
import { logger } from "../Fuctions/logger.js";


const router = Router();

router.get('/', async (req, res) => {
try {
        logger.debug('Este es un mensaje de debug');
        logger.http('Este es un mensaje HTTP');
        logger.info('Este es un mensaje de información');
        logger.warning('Este es un mensaje de advertencia');
        logger.error('Este es un mensaje de error');
        logger.fatal('Este es un mensaje fatal');
      
        res.send('Logs enviados al logger.');
} catch (error) {
    logger.error(`Error en la ruta /: ${error.message}`)
    return res.status(500).json('Ha habido un error en la ruta')
}
});

export default router