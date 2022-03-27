const db = require("../db").db;
const Sequelize = require("../db").sequelize;
const {body, param, validationResult} = require('express-validator')
const {sequelize} = require("../db");
const {QueryTypes, Op} = require("sequelize");


const KEYS = {
    Id: "id",
    ConversationId:"c",
    SenderId: "s",
    ReceiverId:"r",
    Message:"m",
    DuelistId: "did",
};

module.exports.FindOrCreateConversation = async function(conversationId, senderId, receiverId){
    return await db.Conversations.findOrCreate({
        where: { id: conversationId },
        defaults: {
            id:null,
            sender_id: senderId,
            receiver_id: receiverId,
        }
    });
};

module.exports.CreateMessage = async function (conversationId, sender_id, message) {
    return await db.Messages.create({
        conversations_id: conversationId,
        sender_id: sender_id,
        message: message
    });
};

module.exports.GetChatMessages = async function (conversationId) {
    return await db.Messages.findAll({
        include: [{association: 'sender',  attributes:["username"]},],
        where: {
            conversations_id: conversationId
        },
        order: [
            ['datetime', 'ASC'],
        ],
    });
}

module.exports.GetChatsForDuelist = async function (duelistId) {
    return await db.Conversations.findAll({
        include: [{association: 'sender', attributes:["username", "id"]}, {association: 'receiver', attributes:["username", "id"]}],
        where: {
            [Op.or]: [{ sender_id: duelistId }, { receiver_id: duelistId }],
        }
    });
}

module.exports.Validators = {
    CreateMessageValidator: function () {
        return [
            body(KEYS.ConversationId).trim(),
            body(KEYS.SenderId).notEmpty().trim(),
            body(KEYS.ReceiverId).notEmpty().trim(),
            body(KEYS.Message).notEmpty().trim(),
        ]
    },
    GetChatsForDuelist: function (){
        return [
            body(KEYS.DuelistId).notEmpty().trim(),
        ]
    },
    GetMessagesValidator: function () {
        return [
            body(KEYS.ConversationId).notEmpty().trim(),
        ]
    },
};

module.exports.Keys = KEYS