import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaSave, FaTimes, FaLeaf } from "react-icons/fa";
import { updateProfile, getCurrentUser } from "../services/api";

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const userData = await getCurrentUser();
      setUser(userData);
      setNombre(userData.nombre);
      setEmail(userData.email);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setErrorMsg("Error al cargar el perfil");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nombre || !email) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Si se intenta cambiar la contraseña, validar campos
    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg("Debes ingresar tu contraseña actual para cambiar la contraseña.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("Las nuevas contraseñas no coinciden.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    try {
      setLoading(true);
      
      const updateData: any = {
        nombre,
        email
      };

      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await updateProfile(updateData);

      console.log("✅ Perfil actualizado:", response);

      if (response?.user) {
        setSuccessMsg("Perfil actualizado correctamente.");
        // Actualizar localStorage
        const updatedUser = {
          id: response.user.id,
          nombre: response.user.nombre,
          email: response.user.email,
          rol: response.user.rol
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Limpiar campos de contraseña
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("❌ Error actualizando perfil:", error);
      setErrorMsg(
        error.response?.data?.message || 
        error.response?.data?.msg || 
        "Error al actualizar el perfil. Verifica los datos e intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originales
    if (user) {
      setNombre(user.nombre);
      setEmail(user.email);
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FaLeaf className="text-green-600 text-5xl" />
            </div>
            <h1 className="text-3xl font-bold text-green-700">
              Mi Perfil
            </h1>
            <p className="text-gray-500 mt-2">
              Actualiza tu información personal
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Información Básica */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Nombre completo *
                </label>
                <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
                  <FaUserAlt className="text-green-600 mr-3" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full outline-none text-gray-700 bg-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Correo electrónico *
                </label>
                <div className="flex items-center border border-green-300 rounded-lg px-4 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition">
                  <FaEnvelope className="text-green-600 mr-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full outline-none text-gray-700 bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Información de Rol (solo lectura) */}
            {user && (
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Rol
                </label>
                <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
                  <p className="text-gray-700 capitalize">{user.rol}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  El rol no puede ser modificado
                </p>
              </div>
            )}

            {/* Cambio de Contraseña */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Cambiar Contraseña (opcional)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-2">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-green-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 font-medium mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-green-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none"
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 font-medium mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      placeholder="Repite la nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-green-300 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition outline-none"
                      minLength={6}
                    />
                  </div>
                </div>
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

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaTimes />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;