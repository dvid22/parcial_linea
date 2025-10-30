import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaCalendarAlt, FaSignOutAlt, FaPlus, FaHome, FaMapMarkerAlt } from "react-icons/fa";
import { getSchedules, createSchedule, deleteSchedule, getBarrios, createBarrio, createSector } from "../services/api";

interface Schedule {
  id: number;
  sectorId: number;
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

interface Barrio {
  id: number;
  nombre: string;
  sectores?: Sector[];
}

interface Sector {
  id: number;
  nombre: string;
  barrioId: number;
}

const AdminPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [selectedBarrio, setSelectedBarrio] = useState<number>(0);
  const [selectedSector, setSelectedSector] = useState<number>(0);
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");
  const [tipo, setTipo] = useState("orgánico");
  const [nuevoBarrio, setNuevoBarrio] = useState("");
  const [nuevoSector, setNuevoSector] = useState("");
  const [barrioParaSector, setBarrioParaSector] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [sectorLoading, setSectorLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("horarios");
  const navigate = useNavigate();

  // 🔹 Cargar horarios y barrios al iniciar
  useEffect(() => {
    fetchSchedules();
    fetchBarrios();
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
        console.warn("⚠️ Formato de respuesta inesperado:", response);
        setSchedules([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener los horarios:", error);
      alert("Error al cargar los horarios");
    }
  };

  const fetchBarrios = async () => {
    try {
      console.log("🔄 Cargando barrios...");
      const response = await getBarrios();
      console.log("📥 Barrios recibidos:", response);
      
      if (Array.isArray(response)) {
        setBarrios(response);
      } else if (response && response.data) {
        setBarrios(response.data);
      } else {
        console.warn("⚠️ Formato de barrios inesperado:", response);
        setBarrios([]);
      }
    } catch (error) {
      console.error("❌ Error al obtener barrios:", error);
    }
  };

  // 🔹 Obtener sectores del barrio seleccionado
  const getSectoresDelBarrio = () => {
    if (!selectedBarrio) return [];
    const barrio = barrios.find(b => b.id === selectedBarrio);
    return barrio?.sectores || [];
  };

  // 🔹 Crear nuevo horario
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector || !dia || !hora || !tipo) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Enviando nuevo horario:", { sectorId: selectedSector, dia, hora, tipo });
      
      await createSchedule({
        sectorId: selectedSector,
        dia,
        hora,
        tipo
      });
      
      // Limpiar formulario
      setSelectedBarrio(0);
      setSelectedSector(0);
      setDia("");
      setHora("");
      setTipo("orgánico");
      
      // Recargar horarios
      await fetchSchedules();
      alert("✅ Horario agregado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al agregar horario:", error);
      alert(error.response?.data?.message || "Error al agregar horario");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nuevo barrio
  const handleAddBarrio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoBarrio.trim()) {
      alert("Por favor ingresa un nombre para el barrio.");
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Creando nuevo barrio:", nuevoBarrio);
      
      await createBarrio({ nombre: nuevoBarrio });
      
      // Limpiar formulario
      setNuevoBarrio("");
      
      // Recargar barrios
      await fetchBarrios();
      alert("✅ Barrio creado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear barrio:", error);
      alert(error.response?.data?.message || "Error al crear barrio");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear nuevo sector
  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoSector.trim() || !barrioParaSector) {
      alert("Por favor selecciona un barrio y ingresa un nombre para el sector.");
      return;
    }

    setSectorLoading(true);
    try {
      console.log("📤 Creando nuevo sector:", { barrioId: barrioParaSector, nombre: nuevoSector });
      
      await createSector({
        barrioId: barrioParaSector,
        nombre: nuevoSector.trim()
      });
      
      // Limpiar formulario
      setNuevoSector("");
      setBarrioParaSector(0);
      
      // Recargar barrios para obtener los nuevos sectores
      await fetchBarrios();
      alert("✅ Sector creado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear sector:", error);
      alert(error.response?.data?.message || "Error al crear sector");
    } finally {
      setSectorLoading(false);
    }
  };

  // 🔹 Eliminar horario
  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este horario?")) return;
    try {
      await deleteSchedule(id);
      await fetchSchedules();
      alert("✅ Horario eliminado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar horario:", error);
      alert(error.response?.data?.message || "Error al eliminar horario");
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔹 Navegar a otras páginas
  const navigateTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">EcoRutas Admin</span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* BOTONES DE NAVEGACIÓN */}
              <button
                onClick={() => navigateTo("/calendar")}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                <FaCalendarAlt /> Calendario
              </button>
              
              <button
                onClick={() => navigateTo("/comments")}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
              >
                💬 Comentarios
              </button>
              
              <button
                onClick={() => navigateTo("/messages")}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
              >
                📧 Mensajes
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                <FaSignOutAlt /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* PESTAÑAS PRINCIPALES */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("horarios")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "horarios" 
                ? "bg-blue-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📅 Gestión de Horarios
          </button>
          <button
            onClick={() => setActiveTab("barrios")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "barrios" 
                ? "bg-green-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🏘️ Gestión de Barrios
          </button>
          <button
            onClick={() => setActiveTab("sectores")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "sectores" 
                ? "bg-purple-600 text-white shadow-lg" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🗺️ Gestión de Sectores
          </button>
        </div>

        {/* CONTENIDO DE PESTAÑAS */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          
          {/* PESTAÑA HORARIOS */}
          {activeTab === "horarios" && (
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <FaCalendarAlt /> Gestión de Horarios de Recolección
              </h2>

              {barrios.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium mb-2">⚠️ Primero debes crear barrios y sectores</p>
                  <p className="text-yellow-600 text-sm">
                    Ve a la pestaña "Gestión de Barrios" para crear barrios y luego a "Gestión de Sectores" para agregar sectores.
                  </p>
                </div>
              ) : (
                <>
                  {/* FORMULARIO DE HORARIOS */}
                  <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
                    {/* Selección de Barrio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barrio
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedBarrio}
                        onChange={(e) => {
                          setSelectedBarrio(Number(e.target.value));
                          setSelectedSector(0);
                        }}
                      >
                        <option value={0}>Seleccionar Barrio</option>
                        {barrios.map((barrio) => (
                          <option key={barrio.id} value={barrio.id}>
                            {barrio.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selección de Sector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sector
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(Number(e.target.value))}
                        disabled={!selectedBarrio}
                      >
                        <option value={0}>Seleccionar Sector</option>
                        {getSectoresDelBarrio().map((sector) => (
                          <option key={sector.id} value={sector.id}>
                            {sector.nombre}
                          </option>
                        ))}
                      </select>
                      {!selectedBarrio && (
                        <p className="text-xs text-gray-500 mt-1">Primero selecciona un barrio</p>
                      )}
                      {selectedBarrio && getSectoresDelBarrio().length === 0 && (
                        <p className="text-xs text-yellow-600 mt-1">
                          Este barrio no tiene sectores. Agrega sectores en la pestaña correspondiente.
                        </p>
                      )}
                    </div>

                    {/* Día de la semana */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Día
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dia}
                        onChange={(e) => setDia(e.target.value)}
                      >
                        <option value="">Seleccionar día</option>
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miércoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                        <option value="Sábado">Sábado</option>
                        <option value="Domingo">Domingo</option>
                      </select>
                    </div>

                    {/* Hora */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora
                      </label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                      />
                    </div>

                    {/* Tipo de recolección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                      >
                        <option value="orgánico">Orgánico</option>
                        <option value="reciclaje">Reciclaje</option>
                        <option value="general">General</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !selectedSector}
                      className="col-span-1 md:col-span-2 lg:col-span-5 mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                    >
                      <FaPlus /> {loading ? "Agregando..." : "Agregar Horario"}
                    </button>
                  </form>

                  {/* LISTADO DE HORARIOS */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-blue-600 text-white">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Barrio</th>
                          <th className="py-3 px-4 font-semibold">Sector</th>
                          <th className="py-3 px-4 font-semibold">Día</th>
                          <th className="py-3 px-4 font-semibold">Hora</th>
                          <th className="py-3 px-4 font-semibold">Tipo</th>
                          <th className="py-3 px-4 font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedules.map((schedule) => (
                          <tr
                            key={schedule.id}
                            className="border-b hover:bg-blue-50 transition"
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
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleDeleteSchedule(schedule.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition text-sm"
                              >
                                <FaTrash /> Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                        {schedules.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <FaCalendarAlt className="text-4xl text-gray-300" />
                                <p>No hay horarios registrados.</p>
                                <p className="text-sm">Agrega el primer horario usando el formulario superior.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PESTAÑA BARRIOS */}
          {activeTab === "barrios" && (
            <div>
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                🏘️ Gestión de Barrios
              </h2>

              {/* FORMULARIO DE BARRIOS */}
              <form onSubmit={handleAddBarrio} className="mb-8 p-4 bg-green-50 rounded-lg">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Barrio
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      value={nuevoBarrio}
                      onChange={(e) => setNuevoBarrio(e.target.value)}
                      placeholder="Ej: Centro, Norte, Sur..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 font-medium"
                  >
                    <FaPlus /> {loading ? "Creando..." : "Crear Barrio"}
                  </button>
                </div>
              </form>

              {/* LISTADO DE BARRIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {barrios.map((barrio) => (
                  <div key={barrio.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{barrio.nombre}</h3>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-green-500" />
                        Sectores: {barrio.sectores?.length || 0}
                      </p>
                      <p>ID: {barrio.id}</p>
                    </div>
                  </div>
                ))}
                {barrios.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    <p>No hay barrios registrados.</p>
                    <p className="text-sm">Crea el primer barrio usando el formulario superior.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PESTAÑA SECTORES */}
          {activeTab === "sectores" && (
            <div>
              <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
                <FaMapMarkerAlt /> Gestión de Sectores
              </h2>

              {barrios.length === 0 ? (
                <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium mb-2">⚠️ Primero debes crear barrios</p>
                  <p className="text-yellow-600 text-sm">
                    Ve a la pestaña "Gestión de Barrios" para crear al menos un barrio antes de agregar sectores.
                  </p>
                </div>
              ) : (
                <>
                  {/* FORMULARIO DE SECTORES */}
                  <form onSubmit={handleAddSector} className="mb-8 p-4 bg-purple-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Barrio
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={barrioParaSector}
                          onChange={(e) => setBarrioParaSector(Number(e.target.value))}
                        >
                          <option value={0}>Seleccionar Barrio</option>
                          {barrios.map((barrio) => (
                            <option key={barrio.id} value={barrio.id}>
                              {barrio.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Sector
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          value={nuevoSector}
                          onChange={(e) => setNuevoSector(e.target.value)}
                          placeholder="Ej: Sector A, Zona Norte, Centro..."
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={sectorLoading}
                      className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                      <FaPlus /> {sectorLoading ? "Creando..." : "Crear Sector"}
                    </button>
                  </form>

                  {/* LISTADO DE SECTORES POR BARRIO */}
                  <div className="space-y-6">
                    {barrios.map((barrio) => (
                      <div key={barrio.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-500" />
                          {barrio.nombre} - Sectores ({barrio.sectores?.length || 0})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {barrio.sectores && barrio.sectores.length > 0 ? (
                            barrio.sectores.map((sector) => (
                              <div key={sector.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="font-medium text-gray-700">{sector.nombre}</p>
                                <p className="text-xs text-gray-500">ID: {sector.id}</p>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-4 text-gray-500">
                              <p>Este barrio no tiene sectores aún.</p>
                              <p className="text-sm">Usa el formulario superior para agregar sectores.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="text-center mt-8 p-6 text-gray-600 bg-white border-t">
        <p>© {new Date().getFullYear()} EcoRutas — Sistema de Gestión Ambiental</p>
        <p className="text-sm text-green-600 mt-1">♻️ Recicla y Cuida tu Ciudad</p>
      </footer>
    </div>
  );
};

export default AdminPage;