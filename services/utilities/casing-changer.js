const snakeCaseStringToPascalCase = (str) => {
    str += '';
    str = str.split('_');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length);
    }
    return str.join('');
};


const listToPascalCase = (list) => {
    return list.map(function (obj) {
        return objectToPascalCase(obj);
    });
};

const objectToPascalCase = (object) => {
    if (typeof object === "object") {
        let newOB = {};
        let kvp = object["dataValues"] ? Object.entries(object["dataValues"]) : Object.entries(object);
        for (const [key, value] of kvp) {
            newOB[snakeCaseStringToPascalCase(key)] = value;
        }
        return newOB;
    }
    return object;
};


module.exports = {
    objectToPascalCase,
    listToPascalCase
};