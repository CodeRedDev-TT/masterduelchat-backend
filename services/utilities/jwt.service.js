const jwt = require("jsonwebtoken");
module.exports.GenerateJWT = function (payload, expiration = "1h", secret = process.env.JWT_SECRET){
    let payloadCfg = {
        ...payload,
    };
    return jwt.sign(payloadCfg, secret, { expiresIn: expiration });
}

module.exports.VerifyJWT = function (token, secret = process.env.JWT_SECRET){
    return jwt.verify(token, secret);
}

module.exports.IsTokenValid = function (token, secret = process.env.JWT_SECRET){
    try{
        jwt.verify(token, secret);
        return true;
    }catch (e){
        return false;
    }
}