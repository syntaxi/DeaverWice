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
            for (let i = 0; i < num; i++) {
                Wound.sendOutput(Wound.rollWound(type, severity, location));
            }
        } else {
            Wound.replyOutput(Wound.rollWound(type, severity, location));
        }
    }

    /**
     * Selects a random wound of the given type, severity and location
     * @param type The type of the wound
     * @param severity The severity of the wound
     * @param location An optional location for the wound
     */
    static rollWound(type, severity, location) {
        if (type = Wound.getType(type)) {
            if (severity = Wound.getSeverity(severity)) {

                let options = WoundTable[type][severity]["any"];
                if (location = Wound.getLocation(location)) {
                    options = options.concat(WoundTable[type][severity][location]);
                } else {
                    options = options.concat(Wound.getAll(type, severity));
                }
                return rollRandom(options) + "";

            } else {
                return "Could not find severity level";
            }
        } else {
            return "Could not find wound type";
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