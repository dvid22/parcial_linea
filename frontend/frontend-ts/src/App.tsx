import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import CalendarPage from "./pages/CalendarPage";
import CommentsPage from "./pages/CommentsPage";
import MessagesPage from "./pages/MessagesPage";
import AdminPage from "./pages/AdminPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import RecoverUsernamePage from "./pages/RecoverUsernamePage";
import ProfilePage from "./pages/ProfilePage";

// ==========================
// 🔒 RUTAS PROTEGIDAS
// ==========================
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================
// 🌎 ANIMACIONES DE TRANSICIÓN
// ==========================
const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

// ==========================
// ⚙️ COMPONENTE PRINCIPAL
// ==========================
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  // Evitar renderizado hasta verificar autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* NAVBAR SOLO CUANDO HAY SESIÓN (no en landing) */}
        {isAuthenticated && <NavBar onLogout={handleLogout} />}

        {/* CONTENIDO PRINCIPAL */}
        <div className={isAuthenticated ? "min-h-[calc(100vh-80px)]" : ""}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* LANDING PAGE (Página pública) */}
              <Route
                path="/"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <LandingPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />

              {/* AUTENTICACIÓN PÚBLICA */}
              <Route
                path="/login"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <Login onLoginSuccess={handleLoginSuccess} />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <Register />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />

              {/* RECUPERACIÓN DE CREDENCIALES (Públicas) */}
              <Route
                path="/forgot-password"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <ForgotPasswordPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />
              <Route
                path="/reset-password"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <ResetPasswordPage />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />
              <Route
                path="/recover-username"
                element={
                  !isAuthenticated ? (
                    <motion.div {...pageVariants}>
                      <RecoverUsernamePage />
                    </motion.div>
                  ) : (
                    <Navigate to="/admin" replace />
                  )
                }
              />

              {/* PÁGINAS PROTEGIDAS */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <motion.div {...pageVariants}>
                      <AdminPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <motion.div {...pageVariants}>
                      <CalendarPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comments"
                element={
                  <ProtectedRoute>
                    <motion.div {...pageVariants}>
                      <CommentsPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <motion.div {...pageVariants}>
                      <MessagesPage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <motion.div {...pageVariants}>
                      <ProfilePage />
                    </motion.div>
                  </ProtectedRoute>
                }
              />

              {/* REDIRECCIÓN POR DEFECTO */}
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? "/admin" : "/"} replace />}
              />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
};

export default App;