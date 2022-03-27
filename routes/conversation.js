var express = require('express');
var router = express.Router();
let MessageService = require("../services/database/access-layers/message.service");
let JWTService = require("../services/utilities/jwt.service");
const JSONResponse = require("../models/JSONResponse");
const {listToPascalCase, objectToPascalCase} = require("../services/utilities/casing-changer");
const {validationResult} = require("express-validator");


router.post("/", ...MessageService.Validators.CreateMessageValidator(), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Invalid Data..."));
    }
    let data = req.body;
    // check if conversation was created for receiver and sender
    let conversation = await MessageService.FindOrCreateConversation(
        data[MessageService.Keys.ConversationId],
        data[MessageService.Keys.SenderId],
        data[MessageService.Keys.ReceiverId],
    );


    // add message to messages table
    let message = await MessageService.CreateMessage(conversation[0].id, data[MessageService.Keys.SenderId], data[MessageService.Keys.Message]);
    if (message) {
        var io = req.app.get('socketIO');
        io.emit('duelist_' + data[MessageService.Keys.SenderId], data[MessageService.Keys.ReceiverId]);
        io.emit('duelist_' + data[MessageService.Keys.ReceiverId], data[MessageService.Keys.SenderId]);
        return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Duelist Chats.", null));
    }
    return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Something went wrong.", null));

});

router.get("/", async function (req, res) {
    let data = req.body;
    let duelistId = JWTService.VerifyJWT(data.token)["aud"];
    // check if conversation was created for receiver and sender

    let chats = await MessageService.GetChatsForDuelist(duelistId);
    return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Duelist Chats.", listToPascalCase(chats)));
});


router.post("/messages", ...MessageService.Validators.GetMessagesValidator(), async function (req, res) {
    let data = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Something went wrong...", errors));
    }

    // check if conversation was created for receiver and sender

    let chats = await MessageService.GetChatMessages(data[MessageService.Keys.ConversationId]);
    return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Chat Messages.", listToPascalCase(chats)));
});


module.exports = router;
