import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLeaf, FaArrowLeft } from "react-icons/fa";
import { forgotPassword } from "../services/api";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Por favor ingresa tu correo electrónico.");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);

      console.log("✅ Respuesta de recuperación:", response);

      if (response?.msg) {
        setSuccessMsg("Se ha enviado un enlace de recuperación a tu correo electrónico.");
      } else {
        setErrorMsg("No se pudo procesar la solicitud. Intenta nuevamente.");
      }
    } catch (error: any) {
      console.error("❌ Error en recuperación:", error);
      setErrorMsg(
        error.response?.data?.message || 
        error.response?.data?.msg || 
        "Error al procesar la solicitud. Verifica tu correo e intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaLeaf className="text-green-600 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-500 mt-2">
            Ingresa tu correo para recibir instrucciones
          </p>
        </div>

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Correo electrónico
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaEnvelope className="text-green-600 mr-3" />
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
                Enviando...
              </div>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 text-green-700 font-semibold hover:text-green-800 hover:underline transition-colors mx-auto"
          >
            <FaArrowLeft className="text-sm" />
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;