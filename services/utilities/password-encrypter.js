const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.hash = async function (password){
    return  await bcrypt.hash(password, saltRounds);
}

module.exports.compare =async function (password, hash){
    return await bcrypt.compare(password, hash);
}

