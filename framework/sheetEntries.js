"use strict";

/**
 * Represents a method of converting the data from it's tabulated format in google sheets into a dictionary format in JS
 */
class Entry {
    /**
     * Given an object and some tabulated data, fill the object with that data
     * @param obj The object to fill
     * @param data The data to fill it with
     */
    static newEntry(obj, data) {
        //NOP
    }

    /**
     * Returns a new instance of the container for this object
     * @returns {object}
     */
    static newObject() {
        return {};
    }

    /**
     * Checks if the data is valid
     * @param data The data to check
     * @returns {boolean} True if the object is valid, false otherwise
     */
    static verifyEntry(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key] === undefined) {
                return false
            }
        }
        return true;
    }

    /**
     * Converts data from raw arrays into a specific class format
     * @param data The data to process
     * @returns {object} The data, converted into the given format
     */
    static processData(data) {
        let result = this.newObject();
        this.newEntry(result, data);
        if (this.verifyEntry(result)) {
            return result
        } else {
            throw new Error(`Could not verify data for entry ${this.name}`)
        }
    }
}

/**
 * Special common case structure where the data is broken up into rows, each of which are an object themselves
 *
 * Classes should extend this and override the {@link RowEntry.verifyRow} and
 * {@link RowEntry.newRow} methods as per their JSDoc
 */
class RowEntry extends Entry {
    /**
     * @inheritDoc
     */
    static verifyEntry(data) {
        for (let i = 0; i < this; i++) {
            if (!this.verifyRow(data)) {
                return false;
            }
        }
        return true;
    }

    /**
     * @inheritDoc
     */
    static newObject() {
        return []
    }

    /**
     * @inheritDoc
     */
    static newEntry(obj, data) {
        for (let i = 0; i < data.length; i++) {
            obj.push({});
            this.newRow(obj[i], data[i]);
        }
        return obj
    }

    /**
     * Given some data, returns true if the object is valid
     * @param data The object to check
     * @returns {boolean} True if it is valid, false otherwise
     */
    static verifyRow(data) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key] === undefined) {
                return false
            }
        }
        return true;
    }

    /**
     * Fills an object with the provided data
     *
     * @param obj The object to put the data into
     * @param data The data to load into the object
     */
    static newRow(obj, data) {
        // NOP
    }
}

module.exports = {
    Entry: Entry,
    RowEntry: RowEntry
};