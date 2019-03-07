"use strict";
const {google} = require('googleapis');
let sheets;
try {
    sheets = google.sheets({version: 'v4', auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w"});
} catch (e) {
    console.log("Failed to load sheets library")
}

const doRequest = Promise.promisify(sheets.spreadsheets.values.get);

class SheetsRequester {

    static getRange(tag) {
        return doRequest({
            spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
            auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
            range: "index!A2:B"
        })
            .then(result => {
                let data = result.data.values;
                for (let i = 0; i < data.length; i++) {
                    if (data[i][0].toLowerCase() === tag.toLowerCase()) {
                        return data[i][1];
                    }
                }
                throw new Error(`Unable to locate range for tag '${tag}'`);
            });
    }

    static getValues(tag) {
        return this.getRange(tag)
            .then(result => {
                return doRequest({
                    spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
                    auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
                    range: result
                })
                    .then(result => result.data.values.slice(result[1]));
            });
    }

    /**
     *
     * @param definition
     * @param data
     * @returns {Array}
     */
    static processData(definition, data) {
        let result = [];
        let map = definition.mapping;

        for (let i = 0; i < data.length; i++) {
            let row = {};
            for (let j = 0; j < map.length; j++) {
                row[map[j].key] = map[j].map(data[i][j])
            }
            if (definition.verify(row)) {
                result.push(row);
            }

        }
        return result;
    }
}

module.exports = SheetsRequester;