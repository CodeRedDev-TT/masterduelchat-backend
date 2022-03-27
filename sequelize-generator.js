const SequelizeAuto = require('sequelize-auto');
const Sequelize = require('sequelize');

const auto = new SequelizeAuto('mdm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    directory: './services/database/schemas', // where to write files
    caseModel: 'p', // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: 'p', // file names created for each model use camelCase.js not snake_case.js
    singularize: false, // convert plural table names to singular model names
    additional: {
        timestamps: false
        // ...options added to each model
    },
    //...
});

auto.run();