import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Sector = sequelize.define("Sector", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  barrioId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "sectores",
  timestamps: true
});

export default Sector;
