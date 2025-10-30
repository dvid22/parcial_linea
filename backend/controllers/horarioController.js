import Horario from '../models/Horario.js';
import Sector from '../models/Sector.js';
import Barrio from '../models/Barrio.js';

// Obtener todos los horarios
export const getHorarios = async (req, res) => {
  try {
    console.log('🔍 Buscando horarios...');
    
    const horarios = await Horario.findAll({
      include: [{
        model: Sector,
        include: [{
          model: Barrio,
          attributes: ['nombre']  // ✅ CORREGIDO: 'nombre' en lugar de 'name'
        }],
        attributes: ['nombre']
      }],
      order: [['dia', 'ASC']]
    });

    console.log(`✅ Encontrados ${horarios.length} horarios`);
    
    res.json({
      success: true,
      data: horarios
    });
  } catch (error) {
    console.error('❌ Error obteniendo horarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los horarios',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Crear nuevo horario
export const createHorario = async (req, res) => {
  try {
    const { sectorId, dia, hora, tipo } = req.body;

    // Validar que el sector existe
    const sector = await Sector.findByPk(sectorId);
    if (!sector) {
      return res.status(404).json({
        success: false,
        message: 'Sector no encontrado'
      });
    }

    const nuevoHorario = await Horario.create({
      sectorId,
      dia,
      hora,
      tipo
    });

    res.status(201).json({
      success: true,
      message: 'Horario creado exitosamente',
      data: nuevoHorario
    });
  } catch (error) {
    console.error('Error creando horario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el horario'
    });
  }
};

// Actualizar horario
export const updateHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia, hora, tipo } = req.body;

    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    await horario.update({ dia, hora, tipo });

    res.json({
      success: true,
      message: 'Horario actualizado exitosamente',
      data: horario
    });
  } catch (error) {
    console.error('Error actualizando horario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el horario'
    });
  }
};

// Eliminar horario
export const deleteHorario = async (req, res) => {
  try {
    const { id } = req.params;

    const horario = await Horario.findByPk(id);
    if (!horario) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado'
      });
    }

    await horario.destroy();

    res.json({
      success: true,
      message: 'Horario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando horario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el horario'
    });
  }
};

// Función para crear datos de prueba
export const crearDatosPrueba = async (req, res) => {
  try {
    // Verificar si ya existen datos
    const existingHorarios = await Horario.count();
    if (existingHorarios > 0) {
      return res.json({
        success: true,
        message: 'Ya existen datos en la base de datos'
      });
    }

    // Crear barrios
    const barrios = await Barrio.bulkCreate([
      { nombre: 'Centro' },
      { nombre: 'Norte' },
      { nombre: 'Sur' }
    ], { ignoreDuplicates: true });

    // Crear sectores
    const sectores = await Sector.bulkCreate([
      { nombre: 'Sector A', barrioId: 1 },
      { nombre: 'Sector B', barrioId: 2 },
      { nombre: 'Sector C', barrioId: 3 }
    ], { ignoreDuplicates: true });

    // Crear horarios
    const horarios = await Horario.bulkCreate([
      { sectorId: 1, dia: 'Lunes', hora: '08:00', tipo: 'Orgánico' },
      { sectorId: 1, dia: 'Miércoles', hora: '08:00', tipo: 'Reciclaje' },
      { sectorId: 2, dia: 'Martes', hora: '09:00', tipo: 'Orgánico' },
      { sectorId: 3, dia: 'Jueves', hora: '07:30', tipo: 'General' }
    ], { ignoreDuplicates: true });

    res.json({
      success: true,
      message: 'Datos de prueba creados exitosamente',
      data: { barrios, sectores, horarios }
    });
  } catch (error) {
    console.error('Error creando datos de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando datos de prueba'
    });
  }
};