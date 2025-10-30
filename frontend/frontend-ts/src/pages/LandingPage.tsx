import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    console.log("🔍 Estado de autenticación en LandingPage:", isAuthenticated);
  }, [isAuthenticated]);

  const handleAdmin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-900">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">♻️</span>
            </div>
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              EcoRutas
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-4"
          >
            {isAuthenticated ? (
              // Botones para usuario AUTENTICADO
              <>
                <button
                  onClick={handleAdmin}
                  className="px-6 py-2 text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  Ir al Admin
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              // Botones para usuario NO autenticado
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 transition-colors border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
              {isAuthenticated ? (
                <>
                  ¡Bienvenido de vuelta a{" "}
                  <span className="text-green-600 dark:text-green-400">
                    EcoRutas
                  </span>
                  !
                </>
              ) : (
                <>
                  Transforma tu{" "}
                  <span className="text-green-600 dark:text-green-400">
                    comunidad
                  </span>{" "}
                  con el reciclaje
                </>
              )}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {isAuthenticated 
                ? "Continúa gestionando tus actividades de reciclaje y conecta con tu comunidad desde el panel de administración."
                : "Conectamos vecinos, recicladores y servicios de recolección en una plataforma inteligente que hace del cuidado ambiental una experiencia simple."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {isAuthenticated ? (
                // Botones para usuario AUTENTICADO
                <>
                  <button
                    onClick={handleAdmin}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Ir al Panel Admin
                  </button>
                  <button
                    onClick={() => navigate("/calendar")}
                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900"
                  >
                    Ver Calendario
                  </button>
                </>
              ) : (
                // Botones para usuario NO autenticado
                <>
                  <Link
                    to="/register"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    Comenzar Ahora
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-center dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900"
                  >
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Usuarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">1.2T</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Material Reciclado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Barrios</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-green-100 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                {/* Feature Icons */}
                {[
                  { icon: "🗓️", text: "Calendario de Recolección", color: "bg-blue-50 dark:bg-blue-900/20" },
                  { icon: "💬", text: "Comunidad Ecológica", color: "bg-green-50 dark:bg-green-900/20" },
                  { icon: "📱", text: "Notificaciones Inteligentes", color: "bg-purple-50 dark:bg-purple-900/20" },
                  { icon: "🌱", text: "Tips de Reciclaje", color: "bg-emerald-50 dark:bg-emerald-900/20" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`${feature.color} p-4 rounded-xl text-center border border-green-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {feature.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg border border-yellow-300"
            >
              ♻️ Eco-Friendly
            </motion.div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg border border-green-400"
            >
              🌍 100% Sostenible
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-800 py-16 mt-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              ¿Por qué usar EcoRutas?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simplificamos la gestión de residuos y promovemos comunidades más sostenibles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🕒",
                title: "Horarios Inteligentes",
                description: "Nunca pierdas el día de recolección con notificaciones inteligentes e integración de calendario"
              },
              {
                icon: "👥",
                title: "Comunidad Activa",
                description: "Conecta con vecinos y servicios locales de reciclaje en tu área"
              },
              {
                icon: "📊",
                title: "Impacto Medible",
                description: "Monitorea tu impacto ambiental y contribución a la sostenibilidad"
              },
              {
                icon: "🗺️",
                title: "Cobertura Local",
                description: "Servicios disponibles en múltiples barrios y sectores de la ciudad"
              },
              {
                icon: "🔔",
                title: "Alertas en Tiempo Real",
                description: "Recibe notificaciones instantáneas sobre cambios en horarios y eventos"
              },
              {
                icon: "💡",
                title: "Educación Ambiental",
                description: "Aprende las mejores prácticas de reciclaje y cuidado del medio ambiente"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-600 group cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {isAuthenticated 
                ? "¡Continúa tu viaje ecológico!" 
                : "¿Listo para unirte a la revolución verde?"
              }
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              {isAuthenticated
                ? "Explora todas las funcionalidades que tenemos para ofrecerte desde el panel de administración."
                : "Miles de personas ya están transformando sus comunidades. Sé parte del cambio hoy mismo."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleAdmin}
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Ir al Panel Admin
                  </button>
                  <button
                    onClick={() => navigate("/calendar")}
                    className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                  >
                    Ver Calendario
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Crear Cuenta Gratis
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                  >
                    Ingresar a Mi Cuenta
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">♻️</span>
                </div>
                <span className="text-xl font-bold text-green-400">
                  EcoRutas
                </span>
              </div>
              <p className="text-gray-400">
                Conectando comunidades para un futuro más verde y sostenible.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-green-400 transition-colors">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="hover:text-green-400 transition-colors">Registrarse</Link></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Guías de Reciclaje</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@ecorutas.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 Ciudad Sostenible</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 EcoRutas. Todos los derechos reservados. 
              <span className="text-green-400 ml-2">Juntos por un planeta más verde 🌍</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;