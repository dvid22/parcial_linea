import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM("usuario","reciclador","admin"), defaultValue: "usuario" },
  // ✅ CAMPOS NUEVOS PARA RECUPERACIÓN
  resetPasswordToken: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  resetPasswordExpires: { 
    type: DataTypes.BIGINT, 
    allowNull: true 
  }
}, {
  tableName: "users",
  timestamps: true,
});

// ✅ HOOKS CORREGIDOS - fuera de la definición
User.beforeCreate(async (user) => {
  console.log("🔐 Hook beforeCreate ejecutándose...");
  if (user.password) {
    console.log("🔐 Hasheando contraseña:", user.password);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log("✅ Contraseña hasheada correctamente");
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password") && user.password) {
    console.log("🔐 Hasheando contraseña actualizada...");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// ✅ MÉTODO COMPARE PASSWORD CON MÁS DEBUG
User.prototype.comparePassword = async function(password) {
  console.log("🔐 Comparando contraseñas...");
  console.log("   - Contraseña ingresada:", password);
  console.log("   - Hash almacenado:", this.password ? "***" : "undefined");
  
  const isValid = await bcrypt.compare(password, this.password);
  console.log("🔐 Resultado comparación bcrypt:", isValid);
  
  return isValid;
};

export default User;