import express from 'express';
import { 
  getHorarios, 
  createHorario, 
  updateHorario, 
  deleteHorario 
} from '../controllers/horarioController.js';

const router = express.Router();

// Rutas públicas temporalmente
router.get('/', getHorarios);
router.post('/', createHorario);
router.put('/:id', updateHorario);
router.delete('/:id', deleteHorario);

export default router;