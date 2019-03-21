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

    /**
     * Requests the value(s) contained within the given range.
     * This range should also include the tab to read from.
     * @param range The range to look up
     * @returns {Promise<object>} The data in the given range
     */
    static requestRange(range) {
        return doRequest({
            spreadsheetId: "1IvVeBEV2H7oBNUWccak1wAsRbXOz77QVEJWvlQ2ACmg",
            auth: "AIzaSyBM0Rchrw_y-sFDbR9KgDrMRuhRkQ4x_5w",
            range: range
        }).then(result => result.data.values);
    }

    /**
     * Wrapper around {@link SheetsRequester.requestRange} that runs the value through the given definition before returning
     * @param definition The definition to use to convert the data
     * @param range The range to retrieve from the location
     * @returns {Promise<object>}
     */
    static getObjectRange(definition, range) {
        return this.requestRange(range)
            .then(result => definition.processData(result))
    }

    /**
     * Returns the value at the end of the tag chain.
     *
     * Initially gets the values in the given range.
     * Then searches for the tag in that range.
     * It then recursively repeats this, with the value from the tag as the next range.
     *
     *
     * @param tags The list of tags still left to go through
     * @param range The range to search for the next tag in
     * @returns {Promise<String>}
     */
    static getTag(tags, range = "index!A2:B") {
        return this.requestRange(range)
            .then(result => {
                    const tag = tags.shift();
                    const row = result.find(row => row[0].toLowerCase() === tag.toLowerCase());
                    if (!row) {
                        throw new Error(`Unable to find tag ${tag} in index`)
                    }
                    if (tags.length > 0) {
                        return this.getTag(tags, row[1])
                    } else {
                        return row[1]
                    }
                }
            )
    }

    /**
     * Wrapper method around {@link SheetsRequester.getTag} that utilises varargs to make it easier
     *
     * @param tags The sequence of tags to follow to find the value
     * @returns {Promise<object>}
     */
    static getTags(...tags) {
        return this.getTag(tags);
    }

    /**
     * Similar to {@link SheetsRequester.getTags}, it steps through the tags in sequence.
     * However it treats the value at the end of the tags as a range itself, and returns the value that points at.
     * This is equivalent to an "indirect" lookup
     *
     * @param tags The sequence of tags to follow
     * @returns {Promise<object>}
     */
    static getValue(...tags) {
        return this.getTag(tags)
            .then(results => {
                return this.requestRange(results)
                    .then(results => results)
            });
    }

    /**
     * Wrapper around {@link SheetsRequester.getValue} that simply runs the returned value through the given entry definition
     * @param tags The tag(s) to lookup
     * @param definition {object<Entry>} The definition of how to convert the values into an object
     * @returns {Promise<object>}
     */
    static getObjectTag(definition, ...tags) {
        return this.getValue(...tags)
            .then(result => {
                return definition.processData(result)
            });
    }
}

module.exports = SheetsRequester;