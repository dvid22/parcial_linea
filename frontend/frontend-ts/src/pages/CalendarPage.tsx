import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaThumbsUp, 
  FaThumbsDown, 
  FaPhoneAlt, 
  FaSignOutAlt, 
  FaCalendarAlt,
  FaComment,
  FaHome,
  FaUsers,
  FaEnvelope
} from "react-icons/fa";
import { getSchedules, getComments, createComment, likeComment, dislikeComment } from "../services/api";

interface Schedule {
  id: number;
  dia: string;
  hora: string;
  tipo: string;
  Sector?: {
    nombre: string;
    Barrio?: {
      nombre: string;
    };
  };
}

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
  // Para likes/dislikes - necesitaremos calcularlos
  Likes?: any[];
}

const CalendarPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedBarrio, setSelectedBarrio] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [tieneReciclaje, setTieneReciclaje] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("calendario");
  const navigate = useNavigate();

  // Cargar horarios y comentarios
  useEffect(() => {
    fetchSchedules();
    fetchComments();
  }, []);

  const fetchSchedules = async () => {
    try {
      console.log("🔄 Cargando horarios...");
      const response = await getSchedules();
      console.log("📥 Horarios recibidos:", response);
      
      // Ajustar según la estructura de respuesta
      if (response.success && response.data) {
        setSchedules(response.data);
      } else if (Array.isArray(response)) {
        setSchedules(response);
      } else {
        console.warn("⚠️ Formato de horarios inesperado:", response);
        setSchedules([]);
      }
    } catch (err) {
      console.error("❌ Error al obtener horarios:", err);
      alert("Error al cargar los horarios");
    }
  };

  const fetchComments = async () => {
    try {
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
    } catch (err) {
      console.error("❌ Error al obtener comentarios:", err);
      alert("Error al cargar los comentarios");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) {
      alert("Por favor, escribe un mensaje.");
      return;
    }

    setLoading(true);
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
      console.error("❌ Error al agregar comentario:", error);
      alert(error.response?.data?.message || "Error al publicar comentario");
    } finally {
      setLoading(false);
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
      
      // Recargar comentarios para ver los likes actualizados
      await fetchComments();
    } catch (error: any) {
      console.error("❌ Error al actualizar reacción:", error);
      alert(error.response?.data?.message || "Error al actualizar reacción");
    }
  };

  // Calcular likes y dislikes para cada comentario
  const getLikesCount = (comment: Comment) => {
    // Si el backend no proporciona counts, mostrar 0 temporalmente
    return 0;
  };

  const getDislikesCount = (comment: Comment) => {
    // Si el backend no proporciona counts, mostrar 0 temporalmente
    return 0;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Navegación entre páginas
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Filtrar barrios únicos
  const barriosUnicos = Array.from(
    new Set(
      schedules
        .map((s) => s.Sector?.Barrio?.nombre)
        .filter((barrio): barrio is string => !!barrio)
    )
  );

  const horariosFiltrados = selectedBarrio
    ? schedules.filter((s) => s.Sector?.Barrio?.nombre === selectedBarrio)
    : schedules;

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

  // Agrupar horarios por día
  const horariosPorDia = horariosFiltrados.reduce((acc, horario) => {
    if (!acc[horario.dia]) {
      acc[horario.dia] = [];
    }
    acc[horario.dia].push(horario);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Calendario EcoRutas</span>
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
                onClick={() => navigateTo("/comments")}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaUsers /> Comunidad
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

      {/* PESTAÑAS PRINCIPALES */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("calendario")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "calendario" 
                ? "bg-green-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaCalendarAlt className="inline mr-2" /> Calendario
          </button>
          <button
            onClick={() => setActiveTab("comentarios")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "comentarios" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FaComment className="inline mr-2" /> Avisos de Reciclaje
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          
          {/* PESTAÑA CALENDARIO */}
          {activeTab === "calendario" && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                <FaCalendarAlt /> Calendario de Recolección
              </h2>

              {/* FILTRO POR BARRIO */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Barrio:
                </label>
                <select
                  value={selectedBarrio}
                  onChange={(e) => setSelectedBarrio(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full md:w-1/3"
                >
                  <option value="">-- Todos los barrios --</option>
                  {barriosUnicos.map((barrio, index) => (
                    <option key={index} value={barrio}>
                      {barrio}
                    </option>
                  ))}
                </select>
              </div>

              {/* CALENDARIO SEMANAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {diasSemana.map((dia) => (
                  <div key={dia} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-green-600 text-white p-3 font-semibold text-center">
                      {dia}
                    </div>
                    <div className="p-4">
                      {horariosPorDia[dia]?.length > 0 ? (
                        horariosPorDia[dia].map((schedule) => (
                          <div key={schedule.id} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-800">
                                {schedule.Sector?.Barrio?.nombre || "N/A"}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                schedule.tipo === 'orgánico' ? 'bg-green-100 text-green-800' :
                                schedule.tipo === 'reciclaje' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {schedule.tipo}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Sector: {schedule.Sector?.nombre || "N/A"}</p>
                              <p>Hora: {schedule.hora}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4 text-sm">
                          No hay recolecciones programadas
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* TABLA DETALLADA (como respaldo) */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vista detallada</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Barrio</th>
                        <th className="py-3 px-4 font-semibold">Sector</th>
                        <th className="py-3 px-4 font-semibold">Día</th>
                        <th className="py-3 px-4 font-semibold">Hora</th>
                        <th className="py-3 px-4 font-semibold">Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {horariosFiltrados.map((schedule) => (
                        <tr
                          key={schedule.id}
                          className="border-b hover:bg-green-50 transition"
                        >
                          <td className="py-3 px-4">
                            {schedule.Sector?.Barrio?.nombre || "N/A"}
                          </td>
                          <td className="py-3 px-4">
                            {schedule.Sector?.nombre || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-medium">{schedule.dia}</td>
                          <td className="py-3 px-4">{schedule.hora}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              schedule.tipo === 'orgánico' ? 'bg-green-100 text-green-800' :
                              schedule.tipo === 'reciclaje' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.tipo}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {horariosFiltrados.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No hay horarios disponibles {selectedBarrio ? "para este barrio" : ""}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PESTAÑA COMENTARIOS */}
          {activeTab === "comentarios" && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <FaComment /> Avisos de Reciclaje
              </h2>

              {/* FORMULARIO DE COMENTARIOS */}
              <form onSubmit={handleAddComment} className="mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tu mensaje:
                    </label>
                    <textarea
                      placeholder="Ej: Tengo botellas plásticas para reciclar, papel, cartón, etc..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={3}
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
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="tieneReciclaje" className="text-sm text-gray-700 font-medium">
                      ♻️ Tengo material reciclable disponible
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !mensaje.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 font-medium"
                  >
                    {loading ? "📤 Publicando..." : "📝 Publicar Aviso"}
                  </button>
                </div>
              </form>

              {/* LISTA DE COMENTARIOS */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-semibold text-blue-700">
                          {comment.User?.nombre || "Usuario"}
                        </span>
                        <p className="text-gray-500 text-sm mt-1">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      
                      {comment.tieneReciclaje && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                          ♻️ Material disponible
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-lg">{comment.mensaje}</p>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleReaction(comment.id, "like")}
                          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
                        >
                          <FaThumbsUp /> {getLikesCount(comment)}
                        </button>
                        <button
                          onClick={() => handleReaction(comment.id, "dislike")}
                          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium"
                        >
                          <FaThumbsDown /> {getDislikesCount(comment)}
                        </button>
                      </div>

                      <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium">
                        <FaPhoneAlt /> Contactar
                      </button>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FaComment className="text-4xl text-gray-300 mx-auto mb-4" />
                    <p className="text-lg mb-2">No hay avisos aún</p>
                    <p className="text-sm">Sé el primero en avisar que tienes material reciclable disponible</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center mt-8 p-6 text-gray-600 bg-white border-t">
        <p>© {new Date().getFullYear()} EcoRutas — Calendario de Recolección</p>
        <p className="text-sm text-green-600 mt-1">🌍 Construyendo una ciudad más limpia y sostenible</p>
      </footer>
    </div>
  );
};

export default CalendarPage;