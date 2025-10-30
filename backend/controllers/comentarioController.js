import Comentario from "../models/Comentario.js";
import Like from "../models/Like.js";

export const listarComentarios = async (req, res) => {
  try {
    console.log("🎯 LISTAR COMENTARIOS - Iniciando...");
    const comentarios = await Comentario.findAll({ order: [['createdAt','DESC']] });
    console.log(`✅ Comentarios encontrados: ${comentarios.length}`);
    res.json(comentarios);
  } catch (error) {
    console.error("❌ Error listar comentarios:", error);
    res.status(500).json({ msg: "Error listar comentarios", error: error.message });
  }
};

export const crearComentario = async (req, res) => {
  try {
    console.log("🎯 CREAR COMENTARIO - Iniciando...");
    console.log("📥 Body recibido:", req.body);
    console.log("👤 Usuario autenticado:", req.user);
    
    const { mensaje, tieneReciclaje } = req.body;
    
    // Validaciones
    if (!req.user || !req.user.id) {
      console.log("❌ No hay usuario en request");
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }
    
    if (!mensaje || !mensaje.trim()) {
      console.log("❌ Mensaje vacío");
      return res.status(400).json({ msg: "El mensaje no puede estar vacío" });
    }
    
    console.log("🔄 Creando comentario en BD...");
    const comentario = await Comentario.create({ 
      userId: req.user.id, 
      mensaje: mensaje.trim(), 
      tieneReciclaje: !!tieneReciclaje 
    });
    
    console.log("✅ Comentario creado exitosamente, ID:", comentario.id);
    res.status(201).json(comentario);
    
  } catch (error) {
    console.error("❌ ERROR en crearComentario:", error);
    console.error("❌ Stack trace:", error.stack);
    res.status(500).json({ 
      msg: "Error crear comentario", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const likeComentario = async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const existing = await Like.findOne({ where: { userId: req.user.id, comentarioId } });
    if (existing && existing.value === 'like') {
      // toggle off
      await existing.destroy();
    } else if (existing && existing.value === 'dislike') {
      existing.value = 'like';
      await existing.save();
    } else {
      await Like.create({ userId: req.user.id, comentarioId, value: 'like' });
    }
    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ msg: "Error like", error: error.message });
  }
};

export const dislikeComentario = async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const existing = await Like.findOne({ where: { userId: req.user.id, comentarioId } });
    if (existing && existing.value === 'dislike') {
      await existing.destroy();
    } else if (existing && existing.value === 'like') {
      existing.value = 'dislike';
      await existing.save();
    } else {
      await Like.create({ userId: req.user.id, comentarioId, value: 'dislike' });
    }
    res.json({ msg: "ok" });
  } catch (error) {
    res.status(500).json({ msg: "Error dislike", error: error.message });
  }
};

// Mark contact: add user id to contactos array of comentario
export const contactarPorComentario = async (req, res) => {
  try {
    const comentarioId = req.params.id;
    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) return res.status(404).json({ msg: "Comentario no encontrado" });
    // avoid duplicates
    const contactos = comentario.contactos || [];
    if (!contactos.includes(req.user.id)) {
      contactos.push(req.user.id);
      comentario.contactos = contactos;
      await comentario.save();
    }
    res.json({ msg: "Contacto registrado" });
  } catch (error) {
    res.status(500).json({ msg: "Error contactar", error: error.message });
  }
};