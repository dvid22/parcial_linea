import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaLock, FaLeaf } from "react-icons/fa";
import { registerUser } from "../services/api";

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nombre || !email || !password || !confirmPassword) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        nombre,
        email,
        password,
      });

      console.log("✅ Respuesta del registro:", response);

      if (response?.user) {
        setSuccessMsg("Registro exitoso. Redirigiendo al inicio de sesión...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg("No se recibió confirmación del registro");
      }
    } catch (error: any) {
      console.error("❌ Error en registro:", error);
      setErrorMsg(
        error.response?.data?.message || 
        error.response?.data?.msg || 
        "Error al registrar usuario. Intenta más tarde."
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
            Crear Cuenta ♻️
          </h1>
          <p className="text-gray-500 mt-2">
            Únete a nuestra comunidad ecológica
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Nombre completo
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaUserAlt className="text-green-600 mr-3" />
              <input
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">
              Correo electrónico
            </label>
            <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
              <FaEnvelope className="text-green-600 mr-3" />
              <input
                type="email"
                placeholder="ejemplo@correo.com"
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
                placeholder="********"
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
                placeholder="********"
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
                Registrando...
              </div>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-500">
          ¿Ya tienes cuenta?
          <button
            onClick={() => navigate("/login")}
            className="text-green-700 font-semibold ml-1 hover:text-green-800 hover:underline transition-colors"
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;