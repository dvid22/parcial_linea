import express from 'express';
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  recoverUsername,
  getCurrentUser,
  updateProfile 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ==========================
// 🔓 RUTAS PÚBLICAS
// ==========================
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/recover-username', recoverUsername);

// ==========================
// 🔐 RUTAS PROTEGIDAS
// ==========================
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

export default router;