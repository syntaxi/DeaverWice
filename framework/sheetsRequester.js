"use strict";
const {google} = require('googleapis');
let sheets;
try {
    sheets = google.sheets({version: 'v4', auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w"});
} catch (e) {
    console.log("Failed to load sheets library")
}

class SheetsRequester {
    static doRequest(options) {
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get(options, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    static getRange(tag) {
        return SheetsRequester.doRequest({
            spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
            auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
            range: "index!A:D"
        })
            .then(result => {
                let data = result.data.values;
                for (let i = 0; i < data.length; i++) {
                    if (data[i][0].toLowerCase() === tag.toLowerCase()) {
                        return [`${data[i][1]}!${data[i][2]}`, parseInt(data[i][3])];
                    }
                }
                throw new Error(`Unable to locate range for tag '${tag}'`);
            });
    }

    static getValues(tag) {
        return this.getRange(tag)
            .then(result => {
                return this.doRequest({
                    spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
                    auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
                    range: result[0]
                })
                    .then(result => result.data.values.slice(result[1]));
            });
    }
}

module.exports = SheetsRequester;