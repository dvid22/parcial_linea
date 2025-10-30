import User from "./User.js";
import Barrio from "./Barrio.js";
import Sector from "./Sector.js";
import Horario from "./Horario.js";
import Comentario from "./Comentario.js";
import Like from "./Like.js";
import Message from "./Message.js";

// define associations
export default function initModels() {
  Barrio.hasMany(Sector, { as: "sectores", foreignKey: "barrioId" });
  Sector.belongsTo(Barrio, { foreignKey: "barrioId" });

  Sector.hasMany(Horario, { foreignKey: "sectorId" });
  Horario.belongsTo(Sector, { foreignKey: "sectorId" });

  User.hasMany(Comentario, { foreignKey: "userId" });
  Comentario.belongsTo(User, { foreignKey: "userId" });

  // Likes stored as a join table (one record per like/dislike)
  User.belongsToMany(Comentario, { through: Like, as: "likedComments", foreignKey: "userId" });
  Comentario.belongsToMany(User, { through: Like, as: "likedBy", foreignKey: "comentarioId" });

  // Messages between users
  User.hasMany(Message, { as: "sentMessages", foreignKey: "fromId" });
  User.hasMany(Message, { as: "receivedMessages", foreignKey: "toId" });
}
