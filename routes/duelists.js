let DuelistService = require("../services/database/access-layers/duelist.service");
//let UserAuthTokenService = require("../services/database/access-layers/user-auth-token.service");
const {validationResult} = require('express-validator');
let express = require('express');
const JSONResponse = require("../models/JSONResponse");
const {GenerateJWT, VerifyJWT, IsTokenValid} = require("../services/utilities/jwt.service");
const {ACCESS_TOKEN_KEYS} = require("../config");
const {listToPascalCase} = require("../services/utilities/casing-changer");
let router = express.Router();


router.post("/", ...DuelistService.Validators.CreateAccountValidator(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Invalid Data...", null));
    }
    let credentials = req.body;
    try{
        let user = await DuelistService.CreateAccount(credentials[DuelistService.Keys.Username], credentials[DuelistService.Keys.Password]);
        if (user) {
            return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Account Created.", null));
        }
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "An error creating your account.", null));
    }catch (e){
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Something went wrong.", e));
    }
});

router.post("/authorize", ...DuelistService.Validators.LoginAccountValidator(), async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Something went wrong...", null));
    }

    let credentials = req.body;

    let user = await DuelistService.GetUserByUserName(credentials[DuelistService.Keys.Username]);
    if (user === null) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "We could not find a matching account for the provided credentials.", null));
    }

    let passwordCorrect = await DuelistService.ValidatePassword(user.id, credentials[DuelistService.Keys.Password]);
    if (passwordCorrect) {
        // generate jwt
        try {
            let token = null;
            let payload = {};
            payload[ACCESS_TOKEN_KEYS.AUDIENCE] = user.id
            token = GenerateJWT(payload, "12h");
            return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Success.", {token}));
        } catch (e) {
            console.log("Problem signing JWT");
            console.log(e);
        }
    }
    return res.sendStatus(500);
});


router.post("/search", ...DuelistService.Validators.UserNameValidator(),  async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Invalid Data...", errors));
    }
    let credentials = req.body;
    try{
        let users = await DuelistService.GetUserByLikeUserName(credentials[DuelistService.Keys.Username]);
        if (users) {
            return res.json(new JSONResponse(JSONResponse.SUCCESS_STATUS, "Duelist Data.", listToPascalCase(users)));
        }
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "An error fetching duelists", null));
    }catch (e){
        return res.json(new JSONResponse(JSONResponse.FAILURE_STATUS, "Something went wrong.", e));
    }
});




module.exports = router;
