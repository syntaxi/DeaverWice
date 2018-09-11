"use strict";
const BasicScript = require('../../framework/basicScript.js');
const WoundTable = require("../../data/wound.json");
const {rollRandom} = require("../../helpers.js");
const {locationLookup, severityLookup} = require('../../data/lookups.json');


class Wound extends BasicScript {

    /**
     * Selects a random element from the correct wound table.
     * Handles short word forms & incorrect results.
     *
     * @param msg The message being replied too
     * @param type The type of wound to roll
     * @param severity The severity of the wound
     * @param location The location of the wound. Optional
     * @param repeats How many times to repeat the command. Optional
     */
    handle(msg, type, severity, location, repeats) {
        /* We use repeats if it exists, else we try location */
        repeats = repeats || location;

        let num = Math.min(Number.parseInt(repeats), 4);
        if (!isNaN(num)) {
            const outFunc = Wound.sendOutput.bind(this, msg);
            Wound.replyOutput(msg, "");
            for (let i = 0; i < num; i++) {
                Wound.rollWound(outFunc, type, severity, location);
            }
        } else {
            const outFunc = Wound.replyOutput.bind(this, msg);
            Wound.rollWound(outFunc, type, severity, location);
        }
    }

    static rollWound(outFunc, type, severity, location) {
        if (type = Wound.getType(type)) {
            if (severity = Wound.getSeverity(severity)) {

                let options = WoundTable[type][severity]["any"];
                if (location = Wound.getLocation(location)) {
                    options = options.concat(WoundTable[type][severity][location]);
                } else {
                    options = options.concat(Wound.getAll(type, severity));
                }
                outFunc(rollRandom(options) + "");

            } else {
                outFunc("Could not find severity level");
            }
        } else {
            outFunc("Could not find wound type");
        }
    }

    static getLocation(location) {
        return location && location.toLowerCase() in locationLookup ? locationLookup[location.toLowerCase()] : undefined;
    }

    static getSeverity(severity) {
        return severity && severity.toLowerCase() in severityLookup ? severityLookup[severity.toLowerCase()] : undefined;
    }

    static getType(type) {
        return type.toLowerCase() in WoundTable ? type.toLowerCase() : undefined;
    }

    /**
     * Gets all the values from all the locations, except for 'any'
     *
     * @param type The type of wound to get from.
     * @param severity The severity level to get from.
     * @returns {Array}
     */
    static getAll(type, severity) {
        let options = [];
        const table = WoundTable[type][severity];
        for (let location in table) {
            if (location !== 'any' && table.hasOwnProperty(location)) {
                options = options.concat(table[location]);
            }
        }
        return options
    }



}

module.exports = Wound;