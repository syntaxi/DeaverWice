"use strict";
const MessageHandler = require('../../messageHandler.js');

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
    "l": "lesser",

    "moderate": "moderate",
    "m": "moderate",

    "severe": "severe",
    "s": "severe"
}

const woundTable = {
    "lesser": {
        "any": ["**Bleed:** Applies _Bleed_ (any)",
            "**Slashed:** Inflicts _Scar_ (any)",
            "**Gnashed:** Counts as two minor wounds, one of these goes away on its own after a turn. (any)"],
        "head": ["**Blinded:** _Blinded_ by blood in eyes. (head)"],
        "torso": ["**Raked:** Counts as two minor wounds, one of these goes away on its own after a turn. (torso)"],
        "arms": ["**Hindered:** _Pain_, one arm. (arms)"],
        "legs": ["**Hobbled:** _Pain_, one leg. (legs)"]
    },
    "moderate": {
        "any": ["Not Added"],
        "head": ["Not Added"],
        "torso": ["Not Added"],
        "arms": ["Not Added"],
        "legs": ["Not Added"]
    },
    "severe": {
        "any": ["Not Added"],
        "head": ["Not Added"],
        "torso": ["Not Added"],
        "arms": ["Not Added"],
        "legs": ["Not Added"]
    }
};

function rollRandom(list) {
    return list.length === 1 ? list[0] : list[Math.floor(Math.random() * list.length)];
}

function getAny(severity) {
    let options = [];
    for (let location in woundTable[severity]) {
        options = options.concat(woundTable[severity][location]);
    }
    return options
}

class Cut extends MessageHandler {
    constructor(bot) {
        super(bot, __filename.slice(0, -3) + '/');
        this.pruneHandlers();
        this.bot = bot;
    }

    handle(msg, severity, location) {
        if (severity = Cut.getSeverity(severity)) {
            if (location = Cut.getLocation(location)) {
                Cut.sendOutput(msg, rollRandom(woundTable[severity][location]));
            } else {
                const options = getAny(severity);
                Cut.sendOutput(msg, rollRandom(options));
            }
        } else {
            Cut.sendOutput(msg, "Could not find severity level");
        }
    }

    static getLocation(location) {
        if (typeof location === "string" && location.toLowerCase() in locationLookup) {
            return locationLookup[location.toLowerCase()];
        } else {
            return undefined;
        }
    }

    static getSeverity(severity) {
        if (typeof severity === "string" && severity.toLowerCase() in severityLookup) {
            return severityLookup[severity.toLowerCase()];
        } else {
            return undefined;
        }
    }
}

module.exports = Cut;