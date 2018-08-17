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
        super();
        this.bot = bot;
    }

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
                    options = options.concat(getAll(type, severity));
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
}

module.exports = Wound;