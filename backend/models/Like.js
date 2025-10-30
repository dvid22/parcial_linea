import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Like = sequelize.define("Like", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  comentarioId: { type: DataTypes.INTEGER, allowNull: false },
  value: { type: DataTypes.ENUM('like','dislike'), allowNull: false }
}, {
  tableName: "likes",
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId','comentarioId'] }
  ]
});

export default Like;
