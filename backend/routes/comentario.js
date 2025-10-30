import express from 'express';
import { 
  listarComentarios, 
  crearComentario, 
  likeComentario, 
  dislikeComentario,
  contactarPorComentario
} from '../controllers/comentarioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

console.log("🔄 COMENTARIOS ROUTER - Configurando rutas...");

// ✅ Aplicar autenticación a TODAS las rutas
router.use(authenticateToken);

// ✅ Middleware para verificar que el usuario llegó correctamente
router.use((req, res, next) => {
  console.log("✅ COMENTARIOS ROUTER - Usuario autenticado:", req.user ? `Sí (ID: ${req.user.id})` : "No");
  next();
});

router.get('/', listarComentarios);

router.post('/', crearComentario);

router.post('/:id/like', likeComentario);
router.post('/:id/dislike', dislikeComentario);
router.post('/:id/contact', contactarPorComentario);

console.log("✅ COMENTARIOS ROUTER - Rutas configuradas");

export default router;