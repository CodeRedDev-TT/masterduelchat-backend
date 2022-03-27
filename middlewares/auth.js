const JSONResponse = require("../models/JSONResponse");
const {VerifyJWT} = require("../services/utilities/jwt.service");
const {REST_ACCESS} = require("../config");
module.exports = {
    IsAuthenticated: function (req, res, next) {
        let path = req.path.trim();
        if(!REST_ACCESS.UNAUTHENTICATED_ROUTES.includes(path)){
            // validate tokens
            let token = "";
            let bearer = req.headers["authorization"];

            if(typeof bearer !== "undefined" && bearer.trim().length > 0){
                token = bearer.split(" ")[1];
                req.body["token"] = token;
            }

            if(typeof token !== "string" || token.trim().length === 0){
                return res.status(403).json(new JSONResponse(JSONResponse.FAILURE_FORBIDDEN,"...", null));
            }

            try {
                // throws an error if expired or invalid
                VerifyJWT(token);
            }catch (e){
                if(e["name"] === "TokenExpiredError"){
                    return res.status(401).json(new JSONResponse(JSONResponse.AUTH_EXPIRED,"Token expired...", null));
                }else {
                    return res.status(403).json(new JSONResponse(JSONResponse.FAILURE_FORBIDDEN,"...", null));
                }
            }
        }
        next();
    }
};