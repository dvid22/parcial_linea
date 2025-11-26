import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/db.js";
import initModels from "./models/initModels.js";

// Importar todas las rutas
import authRoutes from "./routes/auth.js";
import barrioRoutes from "./routes/barrio.js";
import horarioRoutes from "./routes/horario.js";
import comentarioRoutes from "./routes/comentario.js";
import messageRoutes from "./routes/message.js";

const app = express();
app.use(cors());
app.use(express.json());

// Middleware de logging para debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Todas las rutas
app.use("/api/auth", authRoutes);
app.use("/api/barrios", barrioRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/comentarios", comentarioRoutes);
app.use("/api/messages", messageRoutes);

// Rutas de sistema
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "🚀 EcoRutas Backend funcionando",
    database: process.env.POSTGRES_DB,
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba de base de datos
app.get("/api/test-db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      success: true, 
      message: "✅ Conexión a PostgreSQL exitosa",
      database: process.env.POSTGRES_DB
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "❌ Error en la base de datos",
      error: error.message 
    });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error global:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta no encontrada
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada"
  });
});

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");
    
    initModels();
    await sequelize.sync({ alter: true });
    console.log("✅ Modelos sincronizados");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Test DB: http://localhost:${PORT}/api/test-db`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    });
    
  } catch (error) {
    console.error("❌ Error al iniciar servidor:", error);
    process.exit(1);
  }
};

start();