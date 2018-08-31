"use strict";
const fs = require('fs');

const JsonSaver = {};
JsonSaver.replaceJson = function (file, data) {
    file = __dirname.split(new RegExp("[/\\\\]")).slice(0, -1).join('/') + file;
    fs.exists(file, (doesExist) => {
        if (doesExist) {
            fs.writeFile(file, JSON.stringify(data, null, 2), () => console.log(`Successfully written data to ${file}`));
        } else {
            console.log(`Error, unable to locate file ${file} to save json data to.`);
        }
    });
};

module.exports = JsonSaver;