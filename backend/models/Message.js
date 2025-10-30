import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fromId: { type: DataTypes.INTEGER, allowNull: false },
  toId: { type: DataTypes.INTEGER, allowNull: false },
  texto: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "messages",
  timestamps: true
});

export default Message;
