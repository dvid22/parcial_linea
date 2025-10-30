// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from 'sequelize';
import { sendPasswordResetEmail, sendUsernameRecoveryEmail } from '../services/emailService.js';

const generarToken = (user) => {
  return jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol = "usuario" } = req.body;
    
    console.log("🎯 REGISTER endpoint llamado");
    console.log("📥 Datos de registro recibidos:", { nombre, email, password: password ? "***" : "undefined" });
    
    // Validaciones básicas
    if (!nombre || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ msg: "Email ya registrado" });
    
    console.log("🔐 Creando usuario...");
    
    // ✅ CREAR USUARIO - los hooks se ejecutarán automáticamente
    const user = await User.create({ 
      nombre, 
      email, 
      password, // ✅ Enviar password en texto plano
      rol 
    });
    
    console.log("✅ Usuario creado en BD:", user.id);
    console.log("🔐 Contraseña después del hook:", user.password ? "***" : "undefined");
    
    const token = generarToken(user);
    
    res.status(201).json({ 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol 
      }, 
      token 
    });
    
    console.log("✅ Registro exitoso");
    
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ msg: "Error al registrar", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("🎯 LOGIN endpoint llamado");
    const { email, password } = req.body;
    
    console.log("📥 Datos de login recibidos:", { email, password: password ? "***" : "undefined" });
    
    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
    }

    console.log("🔍 Buscando usuario...");
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    console.log("✅ Usuario encontrado:", { id: user.id, email: user.email });
    console.log("🔐 Hash en BD:", user.password ? "***" : "undefined");
    
    // ✅ OPCIÓN 1: Usar el método del modelo
    console.log("🔐 Usando comparePassword del modelo...");
    const valid = await user.comparePassword(password);
    
    if (!valid) {
      console.log("❌ CONTRASEÑA INCORRECTA");
      
      // ✅ OPCIÓN 2: Verificar manualmente como fallback
      console.log("🔐 Verificando manualmente con bcrypt...");
      const manualCheck = await bcrypt.compare(password, user.password);
      console.log("🔐 Resultado manual:", manualCheck);
      
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }
    
    const token = generarToken(user);
    console.log("✅ Token generado para usuario:", user.id);
    
    res.json({ 
      user: { 
        id: user.id, 
        nombre: user.nombre, 
        email: user.email, 
        rol: user.rol 
      }, 
      token 
    });
    
    console.log("✅ LOGIN EXITOSO");
    
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ msg: "Error en login", error: error.message });
  }
};

// ✅ NUEVAS FUNCIONES DE RECUPERACIÓN

export const forgotPassword = async (req, res) => {
  try {
    console.log("🎯 FORGOT-PASSWORD endpoint llamado");
    const { email } = req.body;
    
    console.log("📥 Email recibido:", email);
    
    if (!email) {
      return res.status(400).json({ msg: "El email es obligatorio" });
    }

    console.log("🔍 Buscando usuario...");
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      // Por seguridad, no revelamos que el email no existe
      return res.json({ 
        msg: "Si el email existe, se ha enviado un enlace de recuperación" 
      });
    }
    
    console.log("✅ Usuario encontrado:", user.id);
    
    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hora
    
    console.log("🔐 Token generado:", resetToken);
    console.log("⏰ Expira:", new Date(resetTokenExpiry));
    
    // Guardar token en la base de datos
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry
    });
    
    console.log("✅ Token guardado en BD");
    
    // ✅ ENVIAR EMAIL REAL
    console.log("📧 Enviando email de recuperación...");
    const emailSent = await sendPasswordResetEmail(user.email, resetToken, user.nombre);
    
    if (!emailSent) {
      console.log("⚠️ No se pudo enviar el email, pero el token fue generado");
      // Aún así respondemos éxito por seguridad
    } else {
      console.log("✅ Email enviado correctamente");
    }
    
    res.json({ 
      msg: "Si el email existe, se ha enviado un enlace de recuperación",
      // En desarrollo, devolvemos el token para testing
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
    
    console.log("✅ Proceso de recuperación completado");
    
  } catch (error) {
    console.error("❌ Error en forgotPassword:", error);
    res.status(500).json({ msg: "Error al procesar la solicitud", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    console.log("🎯 RESET-PASSWORD endpoint llamado");
    const { token, newPassword } = req.body;
    
    console.log("📥 Datos recibidos:", { 
      token: token ? "***" : "undefined", 
      newPassword: newPassword ? "***" : "undefined" 
    });
    
    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token y nueva contraseña son obligatorios" });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" });
    }

    console.log("🔍 Buscando usuario con token válido...");
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });
    
    if (!user) {
      console.log("❌ Token inválido o expirado");
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }
    
    console.log("✅ Usuario encontrado:", user.id);
    
    // Actualizar contraseña (el hook beforeUpdate se encargará del hash)
    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    console.log("✅ Contraseña actualizada correctamente");
    
    res.json({ msg: "Contraseña actualizada correctamente" });
    
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({ msg: "Error al actualizar la contraseña", error: error.message });
  }
};

export const recoverUsername = async (req, res) => {
  try {
    console.log("🎯 RECOVER-USERNAME endpoint llamado");
    const { email } = req.body;
    
    console.log("📥 Email recibido:", email);
    
    if (!email) {
      return res.status(400).json({ msg: "El email es obligatorio" });
    }

    console.log("🔍 Buscando usuario...");
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      // Por seguridad, no revelamos que el email no existe
      return res.json({ 
        msg: "Si el email existe, se ha enviado tu nombre de usuario" 
      });
    }
    
    console.log("✅ Usuario encontrado:", { id: user.id, nombre: user.nombre });
    
    // ✅ ENVIAR EMAIL REAL
    console.log("📧 Enviando email de recuperación de usuario...");
    const emailSent = await sendUsernameRecoveryEmail(user.email, user.nombre);
    
    if (!emailSent) {
      console.log("⚠️ No se pudo enviar el email, pero el proceso continuó");
    } else {
      console.log("✅ Email de usuario enviado correctamente");
    }
    
    res.json({ 
      msg: "Si el email existe, se ha enviado tu nombre de usuario",
      // En desarrollo, devolvemos el nombre de usuario para testing
      username: process.env.NODE_ENV === 'development' ? user.nombre : undefined
    });
    
    console.log("✅ Proceso de recuperación de usuario completado");
    
  } catch (error) {
    console.error("❌ Error en recoverUsername:", error);
    res.status(500).json({ msg: "Error al procesar la solicitud", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    console.log("🎯 GET-CURRENT-USER endpoint llamado");
    
    // Tu middleware authenticateToken ya adjuntó el usuario a req.user
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    console.log("✅ Usuario actual:", { id: user.id, nombre: user.nombre });
    
    // Buscar información completa del usuario desde la BD
    const fullUser = await User.findByPk(user.id);
    if (!fullUser) {
      return res.status(404).json({ msg: "Usuario no encontrado en BD" });
    }
    
    res.json({
      id: fullUser.id,
      nombre: fullUser.nombre,
      email: fullUser.email,
      rol: fullUser.rol
    });
    
  } catch (error) {
    console.error("❌ Error en getCurrentUser:", error);
    res.status(500).json({ msg: "Error al obtener usuario", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("🎯 UPDATE-PROFILE endpoint llamado");
    const { nombre, email, currentPassword, newPassword } = req.body;
    const userFromToken = req.user; // Del middleware authenticateToken
    
    console.log("📥 Datos recibidos:", { 
      nombre, 
      email, 
      currentPassword: currentPassword ? "***" : "undefined",
      newPassword: newPassword ? "***" : "undefined"
    });
    
    if (!userFromToken) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    
    // Buscar el usuario completo de la base de datos
    const user = await User.findByPk(userFromToken.id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado en BD" });
    }
    
    // Preparar datos a actualizar
    const updateData = {};
    
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    
    // Si se quiere cambiar la contraseña
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ msg: "La contraseña actual es requerida" });
      }
      
      // Verificar contraseña actual
      const validPassword = await user.comparePassword(currentPassword);
      if (!validPassword) {
        return res.status(401).json({ msg: "Contraseña actual incorrecta" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ msg: "La nueva contraseña debe tener al menos 6 caracteres" });
      }
      
      updateData.password = newPassword;
    }
    
    console.log("🔧 Actualizando usuario...");
    await user.update(updateData);
    
    console.log("✅ Perfil actualizado correctamente");
    
    res.json({
      msg: "Perfil actualizado correctamente",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
    
  } catch (error) {
    console.error("❌ Error en updateProfile:", error);
    res.status(500).json({ msg: "Error al actualizar perfil", error: error.message });
  }
};