import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaLeaf, FaQuestionCircle } from "react-icons/fa";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      
      const response = await loginUser({
        email,
        password,
      });

      console.log("✅ Respuesta completa del login:", response);

      if (response?.token) {
        // Guardar token y usuario
        localStorage.setItem("token", response.token);
        
        const userData = {
          id: response.user.id,
          nombre: response.user.nombre,
          email: response.user.email,
          rol: response.user.rol
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ Usuario guardado:", userData);
        console.log("✅ Token guardado:", response.token);
        
        // ✅ PRIMERO actualizar el estado de autenticación
        onLoginSuccess();
        
        // ✅ LUEGO redirigir directamente a ADMIN PAGE
        setTimeout(() => {
          console.log("🔄 Redirigiendo a /admin...");
          navigate("/admin", { replace: true });
        }, 100);
        
      } else {
        setErrorMsg("No se recibió token de autenticación");
        console.error("❌ No se recibió token:", response);
      }
    } catch (error: any) {
      console.error("❌ Error completo del login:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.data?.msg) {
        setErrorMsg(error.response.data.msg);
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.code === 'ECONNREFUSED') {
        setErrorMsg("El servidor no está disponible. Verifica que el backend esté ejecutándose.");
      } else if (error.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Error al iniciar sesión. Intenta más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("🔄 Redirigiendo a recuperación de contraseña");
    navigate("/forgot-password");
  };

  const handleRecoverUsername = () => {
    console.log("🔄 Redirigiendo a recuperación de usuario");
    navigate("/recover-username");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-green-600 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">
            Iniciar Sesión ♻️
          </h1>
          <p className="text-gray-500 mt-2">
            Bienvenido al sistema de recolección y reciclaje
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Correo electrónico
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaUserAlt className="text-green-600 mr-3" />
              <input
                type="email"
                placeholder="Tu email registrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Contraseña
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaLock className="text-green-600 mr-3" />
              <input
                type="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm text-center font-medium">
                {errorMsg}
              </p>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm text-center font-medium">
                {successMsg}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Iniciando sesión...
              </div>
            ) : (
              "Entrar"
            )}
          </button>

          {/* BOTONES DE RECUPERACIÓN - REDIRIGEN DIRECTAMENTE */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleRecoverUsername}
              className="flex items-center justify-center gap-2 text-green-700 font-medium hover:text-green-800 hover:underline transition-colors text-sm py-2"
            >
              <FaQuestionCircle className="text-sm" />
              ¿Olvidaste tu nombre de usuario?
            </button>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="flex items-center justify-center gap-2 text-green-700 font-medium hover:text-green-800 hover:underline transition-colors text-sm py-2"
            >
              <FaLock className="text-sm" />
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-700 font-semibold hover:text-green-800 hover:underline transition-colors"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;