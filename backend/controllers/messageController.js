import Message from "../models/Message.js";
import User from "../models/User.js";
import { Op } from 'sequelize';

export const sendMessage = async (req, res) => {
  try {
    console.log("🎯 SEND MESSAGE - Iniciando...");
    console.log("👤 Usuario autenticado:", req.user);
    console.log("📥 Body recibido:", req.body);
    
    const { toId, texto } = req.body;
    
    // Validaciones
    if (!req.user || !req.user.id) {
      console.log("❌ No hay usuario autenticado");
      return res.status(401).json({ msg: "Usuario no autenticado" });
    }
    
    if (!toId || !texto) {
      console.log("❌ Datos incompletos");
      return res.status(400).json({ msg: "Destinatario y texto son requeridos" });
    }

    console.log("🔄 Buscando destinatario...");
    const recipient = await User.findByPk(toId);
    if (!recipient) {
      console.log("❌ Destinatario no encontrado:", toId);
      return res.status(404).json({ msg: "Destinatario no encontrado" });
    }

    console.log("✅ Destinatario encontrado:", recipient.email);
    console.log("🔄 Creando mensaje...");
    
    const msg = await Message.create({ 
      fromId: req.user.id, 
      toId, 
      texto 
    });

    console.log("✅ Mensaje creado exitosamente, ID:", msg.id);
    res.status(201).json(msg);
    
  } catch (error) {
    console.error("❌ ERROR en sendMessage:", error);
    res.status(500).json({ msg: "Error enviar mensaje", error: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    console.log("🎯 GET CONVERSATION - Iniciando...");
    console.log("👤 Usuario autenticado:", req.user);
    console.log("📥 Parámetros:", req.params);
    
    const otherId = parseInt(req.params.userId);
    const me = req.user.id;
    
    console.log("🔄 Buscando conversación entre:", me, "y", otherId);
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { fromId: me, toId: otherId },
          { fromId: otherId, toId: me }
        ]
      },
      order: [['createdAt','ASC']],
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'nombre', 'email']
        }
      ]
    });
    
    console.log(`✅ Conversación encontrada: ${messages.length} mensajes`);
    res.json(messages);
    
  } catch (error) {
    console.error("❌ ERROR en getConversation:", error);
    res.status(500).json({ msg: "Error obtener conversación", error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    console.log("🎯 GET MESSAGES - Iniciando...");
    console.log("👤 Usuario autenticado:", req.user);
    
    const userId = req.user.id;
    
    console.log("🔄 Buscando todos los mensajes del usuario:", userId);
    
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { fromId: userId },
          { toId: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'nombre', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Mensajes encontrados: ${messages.length}`);
    res.json({
      success: true,
      data: messages
    });
    
  } catch (error) {
    console.error("❌ ERROR en getMessages:", error);
    res.status(500).json({ 
      msg: "Error obteniendo mensajes", 
      error: error.message 
    });
  }
};