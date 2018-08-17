"use strict";
const MessageHandler = require('../../messageHandler.js');
const WoundTable = require("../../data/woundTable.json");

const locationLookup = {
    "any": "any",

    "head": "head",
    "h": "head",

    "torso": "torso",
    "t": "torso",

    "arms": "arms",
    "arm": "arms",
    "a": "arms",

    "legs": "legs",
    "leg": "legs",
    "l": "legs"
};

const severityLookup = {
    "lesser": "lesser",
    "less": "lesser",
    "l": "lesser",

    "moderate": "moderate",
    "m": "moderate",
    "mod": "moderate",

    "critical": "critical",
    "crit": "critical",
    "c": "critical"
};

/**
 * Picks a random entry from a given list.
 *
 * @param list The list to pick from.
 * @returns {*} The item from the list.
 */
function rollRandom(list) {
    switch (list.length) {
        case 0:
            return undefined;
        case 1:
            return list[0];
        default:
            return list[Math.floor(Math.random() * list.length)];
    }
}

/**
 * Gets all the values from all the locations, except for 'any'
 *
 * @param type The type of wound to get from.
 * @param severity The severity level to get from.
 * @returns {Array}
 */
function getAll(type, severity) {
    let options = [];
    const table = WoundTable[type][severity];
    for (let location in table) {
        if (location !== 'any' && table.hasOwnProperty(location)) {
            options = options.concat(table[location]);
        }
    }
    return options
}

class Wound extends MessageHandler {
    constructor(bot) {
        super(bot, __filename.slice(0, -3) + '/');
        this.pruneHandlers();
        this.bot = bot;
    }

    /**
     * Selects a random element from the correct wound table.
     * Handles short word forms & incorrect results.
     *
     * @param msg The message being replied too
     * @param type The type of wound to roll
     * @param severity The severity of the wound
     * @param location THe location of the wound. Optional
     */
    handle(msg, type, severity, location) {
        if (type = Wound.getType(type)) {
            if (severity = Wound.getSeverity(severity)) {

                let options = WoundTable[type][severity]["any"];
                if (location = Wound.getLocation(location)) {
                    options = options.concat(WoundTable[type][severity][location]);
                } else {
                    options = options.concat(getAll(type, severity));
                }
                Wound.sendOutput(msg, rollRandom(options) + "");

            } else {
                Wound.sendOutput(msg, "Could not find severity level");
            }
        } else {
            Wound.sendOutput(msg, "Could not find wound type");
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
}

module.exports = Wound;