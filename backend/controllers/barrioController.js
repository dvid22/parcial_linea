
// Importar directamente
import Barrio from "../models/Barrio.js";
import Sector from "../models/Sector.js";

export const crearBarrio = async (req, res) => {
  try {
    const { nombre, direccion, descripcion } = req.body;
    const barrio = await Barrio.create({ nombre, direccion, descripcion });
    res.status(201).json(barrio);
  } catch (error) {
    res.status(500).json({ msg: "Error crear barrio", error: error.message });
  }
};

export const listarBarrios = async (req, res) => {
  try {
    const barrios = await Barrio.findAll({ 
      include: [{ 
        model: Sector, 
        as: "sectores" 
      }] 
    });
    res.json(barrios);
  } catch (error) {
    res.status(500).json({ msg: "Error listar barrios", error: error.message });
  }
};

export const crearSector = async (req, res) => {
  try {
    const { barrioId, nombre } = req.body;
    const sec = await Sector.create({ barrioId, nombre });
    res.status(201).json(sec);
  } catch (error) {
    res.status(500).json({ msg: "Error crear sector", error: error.message });
  }
};
