import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log("🔐 MIDDLEWARE AUTH - Verificando token para ruta:", req.method, req.url);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log("🔐 Token recibido:", token ? "Sí" : "No");
    console.log("🔐 Header Authorization completo:", authHeader);

    if (!token) {
      console.log("❌ MIDDLEWARE AUTH - No token provided");
      return res.status(401).json({ 
        success: false,
        message: 'Token de acceso requerido' 
      });
    }

    console.log("🔄 Verificando token JWT...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token JWT válido, usuario ID:", decoded.id);

    console.log("🔄 Buscando usuario en BD...");
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      console.log("❌ MIDDLEWARE AUTH - Usuario no encontrado en BD");
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    console.log("✅ Usuario encontrado:", user.email);
    
    req.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    };

    console.log("✅ MIDDLEWARE AUTH - Autenticación exitosa, usuario:", req.user);
    console.log("✅ MIDDLEWARE AUTH - Pasando al siguiente middleware...");
    next();
    
  } catch (error) {
    console.error("❌ MIDDLEWARE AUTH - Error:", error.message);
    console.error("❌ MIDDLEWARE AUTH - Error name:", error.name);
    
    if (error.name === 'JsonWebTokenError') {
      console.log("❌ MIDDLEWARE AUTH - Token JWT inválido");
      return res.status(403).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log("❌ MIDDLEWARE AUTH - Token JWT expirado");
      return res.status(403).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }

    console.log("❌ MIDDLEWARE AUTH - Error general de autenticación");
    return res.status(403).json({ 
      success: false,
      message: 'Error de autenticación' 
    });
  }
};

export const requireAdmin = (req, res, next) => {
  console.log("🔐 MIDDLEWARE REQUIRE ADMIN - Verificando rol...");
  console.log("🔐 Usuario actual:", req.user);
  
  if (!req.user) {
    console.log("❌ MIDDLEWARE REQUIRE ADMIN - No hay usuario en request");
    return res.status(401).json({ 
      success: false,
      message: 'Usuario no autenticado' 
    });
  }
  
  if (req.user.rol !== 'admin') {
    console.log("❌ MIDDLEWARE REQUIRE ADMIN - Usuario no es admin, rol:", req.user.rol);
    return res.status(403).json({ 
      success: false,
      message: 'Se requieren privilegios de administrador' 
    });
  }
  
  console.log("✅ MIDDLEWARE REQUIRE ADMIN - Usuario es admin");
  next();
};