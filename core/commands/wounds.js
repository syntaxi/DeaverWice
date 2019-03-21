"use strict";

const MessageReceiver = require("../../framework/messageReceiver.js");
const SheetsRequester = require("../../framework/sheetsRequester");
const {Entry, RowEntry} = require("../../framework/sheetEntries.js");
const {rollRandom} = require("../../helpers.js");
const {severityLookup, locationLookup} = require("../../data/lookups.json");

/**
 * @typedef {{
 *    part: String
 *    name: String
 *    effect: String
 * }} WoundEffect
 */
class WoundEffect extends RowEntry {
    static newRow(obj, data) {
        obj.part = data[0];
        obj.name = data[1];
        obj.effect = data[2];
    }

    static verifyRow(obj) {
        return obj.name && obj.effect;
    }

    static woundToString(obj) {
        return `**${obj.name}** (${obj.part}): ${obj.effect}`
    }

}

/**
 * @typedef {{
 *      name: string
 *      description: string,
 *      any: WoundEffect[]
 *      head: WoundEffect[]
 *      torso: WoundEffect[]
 *      legs: WoundEffect[]
 *      arms: WoundEffect[]
 * }} WoundSeverity
 */
class WoundSeverity extends Entry {
    static newObject() {
        return {
            any: [],
            head: [],
            torso: [],
            legs: [],
            arms: []
        }
    }

    static newEntry(obj, data) {
        obj.name = data[0][0];
        obj.description = data[1][0];
        let effects = WoundEffect.processData(data.slice(3));
        let part = "";
        for (let i = 0; i < effects.length; i++) {
            part = effects[i].part || part;
            effects[i].part = part;
            obj[part.toLowerCase()].push(effects[i]);
        }
    }

    static verifyEntry(obj) {
        return obj.name && obj.description;
    }
}

/**
 * @typedef {{
 *     name: string,
 *     lesser : WoundSeverity
 *     moderate: WoundSeverity,
 *     critical: WoundSeverity
 * }} WoundType
 */
class WoundType extends Entry {
    /**
     *
     * @param obj {WoundType}
     * @param data
     */
    static newEntry(obj, data) {
        obj.name = data[0][0];

        let startIndex = data.findIndex(row => row[0] && row[0].toLowerCase() === "lesser");
        let endIndex = data.findIndex(row => row[0] && row[0].toLowerCase() === "moderate");
        obj.lesser = WoundSeverity.processData(data.slice(startIndex, endIndex - 1));

        startIndex = data.findIndex(row => row[0] && row[0].toLowerCase() === "moderate");
        endIndex = data.findIndex(row => row[0] && row[0].toLowerCase() === "critical");
        obj.moderate = WoundSeverity.processData(data.slice(startIndex, endIndex - 1));

        startIndex = data.findIndex(row => row[0] && row[0].toLowerCase() === "critical");
        obj.critical = WoundSeverity.processData(data.slice(startIndex));
    }
}


class Wounds extends MessageReceiver {
    constructor() {
        super();
        this.wounds = {};
        throw new Error("Block loading of wounds as it's unfinished")
    }

    onBegin() {
        return SheetsRequester.getValue("woundindex")
            .then(result => {
                let promises = [];
                for (let i = 0; i < result.length; i++) {
                    let promise = SheetsRequester.getObjectRange(WoundType, result[i][1])
                        .then(result => this.wounds[result.name.toLowerCase()] = result);
                    promises.push(promise);
                }
                return Promise.all(promises);
            })
            .then(this.registerWoundCommands.bind(this))
    }

    registerWoundCommands() {
        for (let key in this.wounds) {
            this.registerCommand(key, this.prependArgs(this.rollWound, key));
        }
    }

    extractSeparate(countArg, args) {
        countArg = parseInt(countArg);
        if (args.length > 0) {
            let severityArg = args.shift();
            if (severityArg in severityLookup) {
                return {
                    count: countArg,
                    severity: severityLookup[severityArg]
                };
            } else {
                throw new Error("Severity not recognised")
                //todo: Error - Severity not recognised
            }
        } else {
            throw new Error("Need both count and type")
            //todo: Error - Need both count and type
        }
    }

    getAllFromEmbedded(arg) {
        let levels = [];
        const regex = {
            lesser: /^(lesser|less|l)/,
            moderate: /^(moderate|mod|m)/,
            critical: /^(critical|crit|c)/
        };
        mainLoop:
            while (arg.length > 0) {
                for (let key in regex) {
                    if (regex[key].test(arg)) {
                        levels.push(key);
                        arg = arg.replace(regex[key], "");
                        continue mainLoop;
                    }
                }
                throw new Error("Unknown element found in embedded form")
                //todo: Error - Unknown element found in embedded form
            }
        return levels;
    }

    handleMixedEmbedded(arg) {
        let count = parseInt(arg.replace(/[A-Z]+$/i, ""));
        let severity = arg.replace(/^\d+/, "");
        if (isNaN(count)) {
            throw Error("Unable to parse count");
            //todo: Error - Unable to parse count
        }
        if (!severity) {
            throw new Error("Count missing severity")
            //todo: Error - Count missing severity
        }

        severity = this.handleStringEmbedded(severity);
        severity[0].count = count;

        return severity
    }

    handleStringEmbedded(arg) {
        if (arg in severityLookup) {
            /* Only one entry, so use that */
            return [{severity: severityLookup[arg], count: 1}]
        } else {
            /* May be multiple to split up */
            return this.getAllFromEmbedded(arg)
                .map(entry => ({count: 1, severity: entry}));
        }
    }

    handleEmbedded(arg) {
        if (/^\d+/.test(arg)) {
            /* It has a count in it at least */
            return this.handleMixedEmbedded(arg)
        } else {
            /* There is defs no count in it */
            return this.handleStringEmbedded(arg)
        }
    }

    extractEmbedded(arg) {
        if (!/\./.test(arg)) {
            let outputs = [];
            arg = arg.split(/(?=\d)/);
            for (let j = 0; j < arg.length; j++) {
                outputs = outputs.concat(this.handleEmbedded(arg[j]));
            }
            return outputs;
        } else {
            throw new Error("No decimal points. Ie, 0.5mod")
            //todo: Error - No decimal points. Ie, 0.5mod
        }
    }

    /**
     *
     * @param arg
     * @param args
     * @return {ArgSeverity[]}
     */
    extractSeverity(arg, args) {
        if (!isNaN(arg)) {
            /* If the whole argument is a number, assume count + level are separate */
            return this.extractSeparate(arg, args);
        } else if (/\d+/.test(arg)) {
            /* If there is numbers in the arg, assume it's embedded as one */
            return this.extractEmbedded(arg);
        } else {
            /* There's no numbers anywhere so try and get the levels outta it */
            return this.handleStringEmbedded(arg);
        }
    }

    /**
     * @typedef {{
     *      part: String,
     *      severities: ArgSeverity[]
     * }} WoundArgs
     * @typedef {{
     *      severity: String,
     *      count: Number
     * }} ArgSeverity
     * Takes the arguments given to the command, and turns them into an object
     * @param args The args given to the wound command
     * @return WoundArgs
     */
    extractArguments(args) {
        let part = "";
        let severities = [];
        while (args.length > 0) {
            let arg = args.shift();
            if (arg in locationLookup) {
                arg = locationLookup[arg];
                if (!part) {
                    part = arg;
                } else {
                    throw new Error("Part included twice")
                    //todo: Error - Part included twice
                }
            } else {
                severities = severities.concat(this.extractSeverity(arg, args));
            }
        }
        return {part: part, severities: severities};
    }

    rollWound(msg, type, ...args) {
        //todo: Validate type
        args = this.extractArguments(args);
        let choices = [];
        for (let i = 0; i < args.severities.length; i++) {
            choices = choices.concat(
                this.pickEffect(type, args.part, args.severities[i]));
        }
        let output = choices
            .filter(value => value !== undefined)
            .map(value => WoundEffect.woundToString(value))
            .join("\n");
        Wounds.replyOutput(msg, output);
    }

    /**
     *
     * @param type
     * @param part
     * @param severity {ArgSeverity}
     * @return {WoundEffect[]}
     */
    pickEffect(type, part, severity) {
        let results = [];
        let choices = this.wounds[type][severity.severity]["any"];
        if (part && part !== "any") {
            choices = choices.concat(this.wounds[type][severity.severity][part]);
        }
        for (let i = 0; i < severity.count; i++) {
            results.push(rollRandom(choices));
        }
        return results;
    }
}

module.exports = Wounds;