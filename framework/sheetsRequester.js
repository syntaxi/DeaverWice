"use strict";
const {google} = require('googleapis');
const sheets = google.sheets({version: 'v4', auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w"});

class SheetsRequester {
    static getRange(tag) {
        return new Promise((resolve, reject) =>
            sheets.spreadsheets.values.get({
                spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
                auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
                range: "index!A:D"
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    data = data.data.values;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i][0].toLowerCase() === tag.toLowerCase()) {
                            resolve([`${data[i][1]}!${data[i][2]}`, parseInt(data[i][3])]);
                            return;
                        }
                    }
                    reject();
                }
            })
        );
    }

    static getValues(tag) {
        return new Promise((resolve, reject) =>
            this.getRange(tag)
                .then((result) =>
                    sheets.spreadsheets.values.get({
                        spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
                        auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
                        range: result[0]
                    }, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data.data.values.slice(result[1]));
                        }
                    })
                )
        );
    }
}

module.exports = SheetsRequester;