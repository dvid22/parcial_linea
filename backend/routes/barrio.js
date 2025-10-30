import express from 'express';
import { 
  crearBarrio, 
  listarBarrios, 
  crearSector 
} from '../controllers/barrioController.js';

const router = express.Router();

// Rutas públicas temporalmente
router.get('/', listarBarrios);
router.post('/', crearBarrio);
router.post('/sector', crearSector);

export default router;