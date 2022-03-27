const db = require("../db").db;
const Sequelize = require("../db").sequelize;
const {body, param, validationResult} = require('express-validator')
const {compare, hash} = require("../../utilities/password-encrypter");
const {QueryTypes, Op} = require("sequelize");


const KEYS = {
    Id: "id",
    Username: "u",
    Password: "p"
};

module.exports.CreateAccount = async function (username, npassword) {
    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
    let hh = await hash(npassword);
    return await db.Duelists.create({
        username: username,
        password: hh
    });
};

module.exports.GetUserById = async function (userId) {
    return await db.Duelists.findOne({
        where: {
            id: userId
        }
    });
}
module.exports.GetUserByUserName = async function (username) {
    return await db.Duelists.findOne({
        where: {
            username: username
        }
    });
}
module.exports.GetUserByLikeUserName = async function (username) {
    return await db.Duelists.findAll({
        attributes:["username", "id"],
        where: {
            username:{
                [Op.like]: `%${username}%`,
            }
        }
    });
}
module.exports.GetUsers = async () => {
    return db.Duelists.findAll();
};


module.exports.ValidatePassword = async function (userId, submittedPassword) {
    var up = await db.Duelists.findOne({
        where: {
            id: userId
        }
    });
    if (up === null) {
        return false;
    }
    return await compare(submittedPassword, up.password);
}
module.exports.Validators = {
    CreateAccountValidator: function () {
        return [
            body(KEYS.Username).notEmpty().trim(),
            body(KEYS.Password).notEmpty().isLength({min: 6}),
        ]
    },
    LoginAccountValidator: function () {
        return [
            body(KEYS.Username).notEmpty().isLength({max: 12}),
            body(KEYS.Password).notEmpty().isLength({min: 6}),
        ]
    },
    UserNameValidator: function () {
        return [
            body(KEYS.Username).notEmpty().trim()
        ]
    }
};

module.exports.Keys = KEYS