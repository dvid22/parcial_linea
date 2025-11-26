import axios from 'axios';

// =============================
// 🔧 CONFIGURACIÓN PRINCIPAL
// =============================
const API_BASE_URL = import.meta.env.VITE_API_URL + '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    // ⚠️ NO aplicar a las rutas de auth públicas (login/register/forgot-password/reset-password)
    const isPublicAuthRequest = 
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/register') ||
      config.url?.includes('/auth/forgot-password') ||
      config.url?.includes('/auth/reset-password') ||
      config.url?.includes('/auth/recover-username');
    
    if (!isPublicAuthRequest) {
      const token = localStorage.getItem('token');
      if (token) {
        // Solo limpiar el token si está entre comillas (para requests normales)
        const cleanToken = token.replace(/^"(.*)"$/, '$1');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =============================
// 🔐 SERVICIOS DE AUTENTICACIÓN (VERSIÓN CORREGIDA)
// =============================

export const loginUser = async (data: { email: string; password: string }) => {
  console.log("🚀 Enviando login a:", `${API_BASE_URL}/auth/login`);
  console.log("📤 Datos enviados:", data);
  
  try {
    // ⚠️ Usar axios directo SIN el interceptor para login/register
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Respuesta del login:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en loginUser:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (data: {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}) => {
  console.log("🚀 Enviando registro a:", `${API_BASE_URL}/auth/register`);
  console.log("📤 Datos enviados:", data);
  
  try {
    // ⚠️ Usar axios directo SIN el interceptor para login/register
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Respuesta del registro:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error.response?.data || error.message);
    throw error;
  }
};

// =============================
// 🔄 SERVICIOS DE RECUPERACIÓN Y PERFIL
// =============================

export const forgotPassword = async (email: string) => {
  console.log("🚀 Enviando recuperación de contraseña para:", email);
  
  try {
    // Usar axios directo ya que es una ruta pública
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { 
      email 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Respuesta de recuperación:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en forgotPassword:", error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  console.log("🚀 Enviando reset de contraseña");
  
  try {
    // Usar axios directo ya que es una ruta pública
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
      token, 
      newPassword 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Respuesta de reset:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en resetPassword:", error.response?.data || error.message);
    throw error;
  }
};

export const recoverUsername = async (email: string) => {
  console.log("🚀 Enviando recuperación de usuario para:", email);
  
  try {
    // Usar axios directo ya que es una ruta pública
    const response = await axios.post(`${API_BASE_URL}/auth/recover-username`, { 
      email 
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Respuesta de recuperación de usuario:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en recoverUsername:", error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  console.log("🚀 Obteniendo usuario actual");
  
  try {
    const response = await api.get('/auth/me');
    console.log("✅ Usuario actual:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en getCurrentUser:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (userData: {
  nombre?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  console.log("🚀 Actualizando perfil:", userData);
  
  try {
    const response = await api.put('/auth/profile', userData);
    console.log("✅ Perfil actualizado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error en updateProfile:", error.response?.data || error.message);
    throw error;
  }
};

// =============================
// 🗓️ SERVICIOS DE HORARIOS
// =============================

export const getSchedules = async () => {
  const response = await api.get('/horarios');
  return response.data;
};

export const createSchedule = async (data: {
  sectorId: number;
  dia: string;
  hora: string;
  tipo: string;
}) => {
  const response = await api.post('/horarios', data);
  return response.data;
};

export const updateSchedule = async (id: number, data: {
  dia?: string;
  hora?: string;
  tipo?: string;
}) => {
  const response = await api.put(`/horarios/${id}`, data);
  return response.data;
};

export const deleteSchedule = async (id: number) => {
  const response = await api.delete(`/horarios/${id}`);
  return response.data;
};

// 🏘️ SERVICIOS DE BARRIOS Y SECTORES
// =============================

export const getBarrios = async () => {
  const response = await api.get('/barrios');
  return response.data;
};

export const createBarrio = async (data: { 
  nombre: string;
  direccion?: string;
  descripcion?: string;
}) => {
  const response = await api.post('/barrios', data);
  return response.data;
};

// ✅ FUNCIÓN CREATE SECTOR AGREGADA
export const createSector = async (data: {
  barrioId: number;
  nombre: string;
}) => {
  const response = await api.post('/barrios/sector', data);
  return response.data;
};

// =============================
// 💬 SERVICIOS DE COMENTARIOS
// =============================

export const getComments = async () => {
  const response = await api.get('/comentarios');
  return response.data;
};

export const createComment = async (data: {
  mensaje: string;
  tieneReciclaje: boolean;
}) => {
  const response = await api.post('/comentarios', data);
  return response.data;
};

export const likeComment = async (id: number) => {
  const response = await api.post(`/comentarios/${id}/like`);
  return response.data;
};

export const dislikeComment = async (id: number) => {
  const response = await api.post(`/comentarios/${id}/dislike`);
  return response.data;
};

// =============================
// 📧 SERVICIOS DE MENSAJES
// =============================

export const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const sendMessage = async (data: {
  toId: number;
  texto: string;
}) => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const getConversation = async (userId: number) => {
  const response = await api.get(`/messages/conversation/${userId}`);
  return response.data;
};

// =============================
// 🧑‍💼 SERVICIOS DE ADMINISTRACIÓN
// =============================

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// =============================
// 🛠️ SERVICIOS DE UTILIDAD
// =============================

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const testDB = async () => {
  const response = await api.get('/test-db');
  return response.data;
};

// =============================
// 📊 SERVICIOS DE DATOS DE PRUEBA
// =============================

export const crearDatosPrueba = async () => {
  const response = await api.post('/horarios/datos-prueba');
  return response.data;
};

// =============================
// 🎯 FUNCIONES DE VALIDACIÓN
// =============================

export const validateToken = async () => {
  try {
    const response = await api.get('/auth/validate');
    return response.data;
  } catch (error: any) {
    console.error("❌ Token inválido:", error.response?.data || error.message);
    throw error;
  }
};

export default api;
