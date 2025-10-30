import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaLeaf, FaCheck } from "react-icons/fa";
import { resetPassword } from "../services/api";

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setValidToken(true);
      console.log("✅ Token obtenido de URL:", tokenFromUrl.substring(0, 10) + "...");
    } else {
      console.log("❌ No se encontró token en la URL");
      setErrorMsg("Enlace inválido o expirado.");
    }
    setTokenChecked(true);
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!password || !confirmPassword) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ LOGS DETALLADOS PARA DEBUG
      console.log("🔐 [FRONTEND] Iniciando reset de contraseña...");
      console.log("📤 [FRONTEND] Token:", token ? `${token.substring(0, 10)}...` : "undefined");
      console.log("📤 [FRONTEND] Nueva contraseña:", password);
      console.log("📤 [FRONTEND] Longitud de contraseña:", password.length);
      
      const response = await resetPassword(token, password);

      console.log("✅ [FRONTEND] Respuesta de reset:", response);

      if (response?.msg || response?.message) {
        const successMessage = response.msg || response.message;
        setSuccessMsg("Contraseña actualizada correctamente. Redirigiendo...");
        console.log("✅ [FRONTEND] Contraseña actualizada - Redirigiendo al login");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        console.log("❌ [FRONTEND] No se recibió mensaje de éxito");
        setErrorMsg("No se pudo actualizar la contraseña. Intenta nuevamente.");
      }
    } catch (error: any) {
      console.error("❌ [FRONTEND] Error en reset:", error);
      console.error("❌ [FRONTEND] Detalles del error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.msg || 
        error.response?.data?.error ||
        "Error al actualizar la contraseña. El enlace puede haber expirado.";
      
      setErrorMsg(errorMessage);
      console.log("❌ [FRONTEND] Mensaje de error mostrado al usuario:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras se verifica el token
  if (!tokenChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-green-600 text-5xl" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
          <FaLeaf className="text-red-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Enlace Inválido</h1>
          <p className="text-gray-600 mb-6">{errorMsg || "El enlace de recuperación no es válido o ha expirado."}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-green-600 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">
            Nueva Contraseña
          </h1>
          <p className="text-gray-500 mt-2">
            Crea una nueva contraseña para tu cuenta
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Nueva contraseña
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaLock className="text-green-600 mr-3" />
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Confirmar contraseña
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaLock className="text-green-600 mr-3" />
              <input
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
                minLength={6}
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
              <p className="text-green-700 text-sm text-center font-medium flex items-center justify-center gap-2">
                <FaCheck />
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
                Actualizando...
              </div>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>
        </form>

        {/* Información de debug para testing - CORREGIDO para Vite */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Debug:</strong> Token: {token ? `${token.substring(0, 10)}...` : "No disponible"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;