import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Barrio = sequelize.define("Barrio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: "barrios",
  timestamps: true
});

export default Barrio;
