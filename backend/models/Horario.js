import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Horario = sequelize.define("Horario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sectorId: { type: DataTypes.INTEGER, allowNull: false },
  dia: { type: DataTypes.ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'), allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: false }, // e.g. "08:00"
  tipo: { type: DataTypes.ENUM('orgánico','reciclaje','general'), defaultValue: 'general' },
  frecuencia: { type: DataTypes.STRING, allowNull: true } // e.g. "Quincenal", "Semanal"
}, {
  tableName: "horarios",
  timestamps: true
});

export default Horario;
