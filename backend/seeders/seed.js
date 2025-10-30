import bcrypt from 'bcryptjs';
import { User, Barrio, Horario, sequelize } from '../models/initModels.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Insertando datos iniciales...');

    // Verificar si ya existen datos
    const userCount = await User.count();
    const barrioCount = await Barrio.count();

    if (userCount > 0 && barrioCount > 0) {
      console.log('✅ Ya existen datos iniciales, omitiendo seeders');
      return;
    }

    // 1. Crear barrios
    const barrios = await Barrio.bulkCreate([
      { name: 'Centro', sector: 'A' },
      { name: 'Norte', sector: 'B' },
      { name: 'Sur', sector: 'C' },
      { name: 'Este', sector: 'D' },
      { name: 'Oeste', sector: 'E' }
    ], { ignoreDuplicates: true });

    // 2. Crear usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Administrador',
      email: 'admin@ecorutas.com',
      password: hashedPassword,
      role: 'admin'
    }, { ignoreDuplicates: true });

    // 3. Crear horarios de recolección
    await Horario.bulkCreate([
      { barrio_id: 1, dia: 'Lunes', hora: '08:00', tipo: 'Orgánico' },
      { barrio_id: 1, dia: 'Miércoles', hora: '08:00', tipo: 'Reciclaje' },
      { barrio_id: 2, dia: 'Martes', hora: '09:00', tipo: 'Orgánico' },
      { barrio_id: 2, dia: 'Viernes', hora: '09:00', tipo: 'Reciclaje' },
      { barrio_id: 3, dia: 'Lunes', hora: '07:30', tipo: 'General' },
      { barrio_id: 4, dia: 'Jueves', hora: '10:00', tipo: 'Orgánico' },
      { barrio_id: 5, dia: 'Viernes', hora: '08:30', tipo: 'Reciclaje' }
    ], { ignoreDuplicates: true });

    console.log('✅ Datos iniciales insertados correctamente');
    
  } catch (error) {
    console.error('❌ Error en seeders:', error);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}