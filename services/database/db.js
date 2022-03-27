const {Sequelize} = require('sequelize');
var initModels = require("./schemas/init-models");

// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
var db = initModels(sequelize);
module.exports = {
    db:db,
    sequelize: sequelize
};