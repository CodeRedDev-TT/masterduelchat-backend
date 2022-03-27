var DataTypes = require("sequelize").DataTypes;
var _Chats = require("./Chats");
var _Conversations = require("./Conversations");
var _Duelists = require("./Duelists");
var _Messages = require("./Messages");

function initModels(sequelize) {
  var Chats = _Chats(sequelize, DataTypes);
  var Conversations = _Conversations(sequelize, DataTypes);
  var Duelists = _Duelists(sequelize, DataTypes);
  var Messages = _Messages(sequelize, DataTypes);

  Conversations.belongsToMany(Duelists, { as: 'sender_id_duelists_messages', through: Messages, foreignKey: "conversations_id", otherKey: "sender_id" });
  Duelists.belongsToMany(Conversations, { as: 'conversations_id_conversations', through: Messages, foreignKey: "sender_id", otherKey: "conversations_id" });
  Duelists.belongsToMany(Duelists, { as: 'receiver_id_duelists', through: Chats, foreignKey: "sender_id", otherKey: "receiver_id" });
  Duelists.belongsToMany(Duelists, { as: 'sender_id_duelists', through: Chats, foreignKey: "receiver_id", otherKey: "sender_id" });
  Duelists.belongsToMany(Duelists, { as: 'receiver_id_duelists_conversations', through: Conversations, foreignKey: "sender_id", otherKey: "receiver_id" });
  Duelists.belongsToMany(Duelists, { as: 'sender_id_duelists_conversations', through: Conversations, foreignKey: "receiver_id", otherKey: "sender_id" });
  Messages.belongsTo(Conversations, { as: "conversation", foreignKey: "conversations_id"});
  Conversations.hasMany(Messages, { as: "messages", foreignKey: "conversations_id"});
  Chats.belongsTo(Duelists, { as: "sender", foreignKey: "sender_id"});
  Duelists.hasMany(Chats, { as: "chats", foreignKey: "sender_id"});
  Chats.belongsTo(Duelists, { as: "receiver", foreignKey: "receiver_id"});
  Duelists.hasMany(Chats, { as: "receiver_chats", foreignKey: "receiver_id"});
  Conversations.belongsTo(Duelists, { as: "sender", foreignKey: "sender_id"});
  Duelists.hasMany(Conversations, { as: "conversations", foreignKey: "sender_id"});
  Conversations.belongsTo(Duelists, { as: "receiver", foreignKey: "receiver_id"});
  Duelists.hasMany(Conversations, { as: "receiver_conversations", foreignKey: "receiver_id"});
  Messages.belongsTo(Duelists, { as: "sender", foreignKey: "sender_id"});
  Duelists.hasMany(Messages, { as: "messages", foreignKey: "sender_id"});

  return {
    Chats,
    Conversations,
    Duelists,
    Messages,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
