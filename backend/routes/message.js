import express from 'express';
import { 
  sendMessage, 
  getConversation, 
  getMessages 
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

console.log("🔄 MESSAGES ROUTER - Configurando rutas...");

// ✅ Aplicar autenticación a TODAS las rutas
router.use(authenticateToken);

// ✅ Middleware para verificar que el usuario llegó correctamente
router.use((req, res, next) => {
  console.log("✅ MESSAGES ROUTER - Usuario autenticado:", req.user ? `Sí (ID: ${req.user.id})` : "No");
  next();
});

router.get('/', (req, res, next) => {
  console.log("📥 GET /api/messages - Solicitado");
  next();
}, getMessages);

router.get('/conversation/:userId', (req, res, next) => {
  console.log("📥 GET /api/messages/conversation/:userId - Solicitado");
  next();
}, getConversation);

router.post('/', (req, res, next) => {
  console.log("📥 POST /api/messages - Solicitado");
  next();
}, sendMessage);

console.log("✅ MESSAGES ROUTER - Rutas configuradas");

export default router;