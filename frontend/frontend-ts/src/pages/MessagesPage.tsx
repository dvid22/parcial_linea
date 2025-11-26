import React, { useEffect, useState } from "react";
import { 
  FaPaperPlane, 
  FaLeaf, 
  FaUserCircle, 
  FaArrowLeft,
  FaHome,
  FaCalendarAlt,
  FaComment,
  FaSignOutAlt,
  FaEnvelope,
  FaUsers
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMessages, sendMessage, getUsers, getConversation } from "../services/api";

interface Message {
  id: number;
  fromId: number;
  toId: number;
  texto: string;
  leido: boolean;
  createdAt: string;
  sender?: {
    id: number;
    nombre: string;
    email: string;
  };
  receiver?: {
    id: number;
    nombre: string;
    email: string;
  };
}

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface BasicUser {
  id: number;
  nombre: string;
  email: string;
  rol?: string;
}

const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [conversationLoading, setConversationLoading] = useState(false);
  const navigate = useNavigate();
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Obtener mensajes y usuarios al cargar
  useEffect(() => {
    fetchMessages();
  }, []);

  // Cargar usuarios cuando los mensajes cambien
  useEffect(() => {
    if (messages.length > 0) {
      fetchAllUsers();
    }
  }, [messages]);

  // Cargar conversación cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.id);
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      console.log("🔄 Cargando mensajes...");
      const response = await getMessages();
      console.log("📥 Mensajes recibidos:", response);
      
      // Ajustar según la estructura de respuesta
      if (response.success && response.data) {
        setMessages(response.data);
      } else if (Array.isArray(response)) {
        setMessages(response);
      } else {
        console.warn("⚠️ Formato de mensajes inesperado:", response);
        setMessages([]);
      }
    } catch (error: any) {
      console.error("❌ Error al obtener los mensajes:", error);
      alert("Error al cargar los mensajes");
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchAllUsers = () => {
    try {
      console.log("🔄 Cargando usuarios desde mensajes...");
      const uniqueUsers = new Map<number, User>();
      
      // Extraer usuarios únicos de los mensajes
      messages.forEach(message => {
        if (message.sender && message.sender.id !== currentUser.id) {
          uniqueUsers.set(message.sender.id, { 
            ...message.sender, 
            rol: (message.sender as any).rol || 'user' 
          } as User);
        }
        if (message.receiver && message.receiver.id !== currentUser.id) {
          uniqueUsers.set(message.receiver.id, { 
            ...message.receiver, 
            rol: (message.receiver as any).rol || 'user' 
          } as User);
        }
      });
      
      setUsers(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
    }
  };

  const fetchConversation = async (userId: number) => {
    try {
      setConversationLoading(true);
      console.log(`🔄 Cargando conversación con usuario ${userId}...`);
      
      const response = await getConversation(userId);
      console.log("📥 Conversación recibida:", response);
      
      if (Array.isArray(response)) {
        setConversation(response);
      } else if (response.data) {
        setConversation(response.data);
      } else {
        setConversation([]);
      }
    } catch (error: any) {
      console.error("❌ Error al obtener la conversación:", error);
      alert("Error al cargar la conversación");
    } finally {
      setConversationLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) {
      alert("Por favor selecciona un destinatario y escribe un mensaje.");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Enviando mensaje a:", selectedUser.id);
      
      await sendMessage({
        toId: selectedUser.id,
        texto: newMessage.trim()
      });
      
      setNewMessage("");
      await fetchConversation(selectedUser.id); // Recargar conversación
      await fetchMessages(); // Recargar lista general de mensajes
      alert("✅ Mensaje enviado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al enviar el mensaje:", error);
      alert(error.response?.data?.message || "Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
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
      return new Date(dateString).toLocaleString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Verificar si el mensaje es propio
  const isOwnMessage = (message: Message) => {
    return message.fromId === currentUser.id;
  };

  // Obtener nombre del usuario para mostrar
  const getUserDisplayName = (user: User) => {
    return user.nombre || user.email.split('@')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FaEnvelope className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Mensajes EcoRutas</span>
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
                onClick={() => navigateTo("/comments")}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                <FaComment /> Comunidad
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
      <div className="max-w-7xl mx-auto mt-6 px-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaLeaf className="text-green-600 text-3xl" />
            <h1 className="text-3xl font-bold text-green-700 text-center">
              Mensajería de la Comunidad ♻️
            </h1>
          </div>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Conecta con otros miembros de la comunidad para coordinar reciclaje, 
            intercambiar materiales y colaborar por un ambiente más sostenible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LISTA DE USUARIOS */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
              <FaUsers /> Contactos
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedUser?.id === user.id
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50 hover:bg-green-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaUserCircle className={`text-2xl ${
                        selectedUser?.id === user.id ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-blue-600 capitalize">
                          {user.rol}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">No hay contactos disponibles</p>
                  <p className="text-xs mt-1">Los contactos aparecerán cuando intercambies mensajes</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* CONVERSACIÓN Y FORMULARIO */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {selectedUser ? (
              <div className="h-[500px] flex flex-col">
                {/* HEADER DE CONVERSACIÓN */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-3xl text-green-600" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Conversación con {getUserDisplayName(selectedUser)}
                      </h3>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>

                {/* MENSAJES */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                  {conversationLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-700"></div>
                      <p className="text-gray-600 mt-2 text-sm">Cargando conversación...</p>
                    </div>
                  ) : conversation.length > 0 ? (
                    conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            isOwnMessage(message) 
                              ? 'bg-green-100 text-green-900 border border-green-200' 
                              : 'bg-blue-50 text-blue-900 border border-blue-200'
                          } rounded-2xl p-4`}
                        >
                          <p className="text-sm font-semibold mb-1">
                            {isOwnMessage(message) ? 'Tú' : getUserDisplayName(selectedUser)}
                          </p>
                          <p className="mb-2">{message.texto}</p>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.createdAt)}
                          </span>
                          {!message.leido && isOwnMessage(message) && (
                            <span className="text-xs text-green-600 ml-2">• Entregado</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <FaPaperPlane className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p>No hay mensajes en esta conversación</p>
                      <p className="text-sm mt-1">Envía el primer mensaje para comenzar</p>
                    </div>
                  )}
                </div>

                {/* FORMULARIO DE ENVÍO */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder={`Escribe un mensaje para ${getUserDisplayName(selectedUser)}...`}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="submit"
                      disabled={loading || !newMessage.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                      <FaPaperPlane /> 
                      {loading ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecciona un contacto</h3>
                <p className="max-w-md mx-auto">
                  Elige un contacto de la lista para comenzar una conversación 
                  sobre reciclaje, coordinación de materiales o cualquier tema ecológico.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="text-center mt-8 p-6 text-gray-600 bg-white border-t">
        <p>© {new Date().getFullYear()} EcoRutas — Mensajería Comunitaria</p>
        <p className="text-sm text-green-600 mt-1">
          💚 Conectando personas por un planeta más limpio
        </p>
      </footer>
    </div>
  );
};

export default MessagesPage;