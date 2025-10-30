import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Comentario = sequelize.define("Comentario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  tieneReciclaje: { type: DataTypes.BOOLEAN, defaultValue: false }, // indicador útil
  contactos: { type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: [] } // userIds que se comunicaron
}, {
  tableName: "comentarios",
  timestamps: true
});

export default Comentario;
