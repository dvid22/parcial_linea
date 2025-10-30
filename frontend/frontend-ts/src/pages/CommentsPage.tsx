import React, { useEffect, useState } from "react";
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaPhoneAlt, 
  FaArrowLeft, 
  FaRecycle,
  FaHome,
  FaCalendarAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaComment,
  FaUsers
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getComments, likeComment, dislikeComment, createComment } from "../services/api";

interface Comment {
  id: number;
  mensaje: string;
  tieneReciclaje: boolean;
  userId: number;
  createdAt: string;
  User?: {
    id: number;
    nombre: string;
    email: string;
  };
  // Para likes - necesitaremos calcularlos desde la relación
  Likes?: any[];
}

const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [tieneReciclaje, setTieneReciclaje] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const navigate = useNavigate();

  // 🔹 Obtener comentarios al cargar la página
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando comentarios...");
      const response = await getComments();
      console.log("📥 Comentarios recibidos:", response);
      
      // Ajustar según la estructura de respuesta
      if (response.success && response.data) {
        setComments(response.data);
      } else if (Array.isArray(response)) {
        setComments(response);
      } else {
        console.warn("⚠️ Formato de comentarios inesperado:", response);
        setComments([]);
      }
    } catch (error: any) {
      console.error("❌ Error al obtener comentarios:", error);
      alert("Error al cargar los comentarios");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      alert("Por favor, escribe un mensaje.");
      return;
    }

    setPosting(true);
    try {
      console.log("📤 Publicando comentario:", { mensaje, tieneReciclaje });
      
      await createComment({
        mensaje: mensaje.trim(),
        tieneReciclaje
      });
      
      setMensaje("");
      setTieneReciclaje(false);
      await fetchComments();
      alert("✅ Comentario publicado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al publicar comentario:", error);
      alert(error.response?.data?.message || "Error al publicar comentario");
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (id: number, type: "like" | "dislike") => {
    try {
      console.log(`🔃 ${type} al comentario ${id}`);
      
      if (type === "like") {
        await likeComment(id);
      } else {
        await dislikeComment(id);
      }
      
      // Recargar comentarios para ver las reacciones actualizadas
      await fetchComments();
    } catch (error: any) {
      console.error("❌ Error al actualizar reacción:", error);
      alert(error.response?.data?.message || "Error al actualizar reacción");
    }
  };

  // Calcular likes y dislikes para cada comentario
  const getLikesCount = (comment: Comment) => {
    // Si el backend no proporciona counts, mostrar 0 temporalmente
    // En una implementación real, esto vendría del backend
    return 0;
  };

  const getDislikesCount = (comment: Comment) => {
    // Si el backend no proporciona counts, mostrar 0 temporalmente
    // En una implementación real, esto vendría del backend
    return 0;
  };

  // Navegación entre páginas
  const navigateTo = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Obtener nombre de usuario
  const getUserName = (comment: Comment) => {
    return comment.User?.nombre || "Usuario";
  };

  // Obtener email de usuario (para contacto)
  const getUserEmail = (comment: Comment) => {
    return comment.User?.email || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FaUsers className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Comunidad EcoRutas</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* BOTONES DE NAVEGACIÓN */}
              <button
                onClick={() => navigateTo("/admin")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaHome /> Admin
              </button>
              
              <button
                onClick={() => navigateTo("/calendar")}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaCalendarAlt /> Calendario
              </button>
              
              <button
                onClick={() => navigateTo("/messages")}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaEnvelope /> Mensajes
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaSignOutAlt /> Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-2 text-center flex items-center justify-center gap-3">
            <FaComment /> Comunidad de Reciclaje
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Conecta con vecinos, comparte materiales reciclables y colabora por un ambiente más limpio
          </p>

          {/* FORMULARIO PARA NUEVO COMENTARIO */}
          <form onSubmit={handleAddComment} className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FaComment className="text-green-600" /> Publica tu aviso
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu mensaje:
                </label>
                <textarea
                  placeholder="Ej: Tengo botellas plásticas para reciclar, papel, cartón, electrónicos, etc..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={4}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tieneReciclaje"
                  checked={tieneReciclaje}
                  onChange={(e) => setTieneReciclaje(e.target.checked)}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 rounded"
                />
                <label htmlFor="tieneReciclaje" className="text-sm text-gray-700 font-medium flex items-center gap-2">
                  <FaRecycle className="text-green-600" /> 
                  Tengo material reciclable disponible para compartir
                </label>
              </div>

              <button
                type="submit"
                disabled={posting || !mensaje.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {posting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <FaComment /> Publicar Aviso
                  </>
                )}
              </button>
            </div>
          </form>

          {/* LISTA DE COMENTARIOS */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
              <p className="text-gray-600 mt-4 text-lg">Cargando comentarios de la comunidad...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <FaComment className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">La comunidad está esperando</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Sé el primero en publicar un aviso sobre materiales reciclables. 
                ¡Tu contribución ayuda a construir una comunidad más sostenible! 🌱
              </p>
            </div>
          ) : (
            <div>
              {/* ESTADÍSTICAS */}
              <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                  📊 Actividad de la Comunidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-700">{comments.length}</div>
                    <div className="text-sm text-gray-600">Avisos Publicados</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-700">
                      {comments.filter(c => c.tieneReciclaje).length}
                    </div>
                    <div className="text-sm text-gray-600">Con Material Reciclable</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-700">
                      {comments.reduce((sum, c) => sum + getLikesCount(c), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Interacciones Totales</div>
                  </div>
                </div>
              </div>

              {/* COMENTARIOS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white group"
                  >
                    {/* Header del comentario */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-green-700 text-sm">
                              {getUserName(comment).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-green-700 block">
                              {getUserName(comment)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje */}
                    <p className="text-gray-800 mb-4 leading-relaxed text-lg">
                      {comment.mensaje}
                    </p>

                    {/* Indicador de reciclaje */}
                    {comment.tieneReciclaje && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium">
                          <FaRecycle />
                          ♻️ Material reciclable disponible
                        </span>
                      </div>
                    )}

                    {/* Acciones y contacto */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleReaction(comment.id, "like")}
                          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium group"
                          title="Me gusta"
                        >
                          <FaThumbsUp className="group-hover:scale-110 transition-transform" /> 
                          <span>{getLikesCount(comment)}</span>
                        </button>
                        <button
                          onClick={() => handleReaction(comment.id, "dislike")}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium group"
                          title="No me gusta"
                        >
                          <FaThumbsDown className="group-hover:scale-110 transition-transform" /> 
                          <span>{getDislikesCount(comment)}</span>
                        </button>
                      </div>

                      {/* Contacto por email */}
                      {getUserEmail(comment) && (
                        <a
                          href={`mailto:${getUserEmail(comment)}?subject=Interés en material reciclable&body=Hola, me interesa el material que publicaste en EcoRutas.`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          <FaEnvelope /> Contactar
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="text-center mt-8 p-6 text-gray-600 bg-white border-t">
        <p>© {new Date().getFullYear()} EcoRutas — Comunidad de Reciclaje</p>
        <p className="text-sm text-green-600 mt-1">
          🌍 Conectando vecinos para un futuro más sostenible
        </p>
      </footer>
    </div>
  );
};

export default CommentsPage;