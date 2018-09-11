"use strict";
const AugmentsTable = require('../../data/augments.json');
const {typeLookup} = require('../../data/lookups.json');

const BasicScript = require('../../framework/basicScript');
const {RichEmbed} = require("discord.js");
const {rollRandom, titleCase} = require("../../helpers.js");

class Augment extends BasicScript {
    handle(msg, type) {
        if (type = Augment.getType(type)) {
            const key = rollRandom(Object.keys(AugmentsTable[type]));
            Augment.sendOutput(msg, Augment.buildAugmentEmbed(type, key));
        } else {
            Augment.sendOutput(msg, "Unknown power classification " + type)
        }
    }

    /**
     * Register the info function
     */
    onBegin() {
        Augment.registerInfoFunction(Augment.augmentInfo);
    }

    /**
     * Attempts to handle a request to display an augment of the given type.
     *
     * @param key The augment to look for
     * @returns {RichEmbed} A rich embed if the augment could be found
     */
    static augmentInfo(key) {
        for (let type in AugmentsTable) {
            if (key in AugmentsTable[type]) {
                return Augment.buildAugmentEmbed(type, key);
            }
        }
    }

    /**
     * Builds a rich embed for the given augment
     *
     * @param type The type of augment
     * @param key The name of the augment
     * @returns {RichEmbed} The newly created embed
     */
    static buildAugmentEmbed(type, key) {
        return new RichEmbed()
            .setTitle(titleCase(key))
            .setColor(0xFF0000)
            .setDescription(AugmentsTable[type][key].effect + `\n\n_(${titleCase(type)})_`);
    }

    /**
     * Tries to convert the given name info a valid power type
     *
     * @param type The name to try and convert
     * @returns {*} The proper name if it could be converted, undefined otherwise
     */
    static getType(type) {
        return type && type.toLowerCase() in typeLookup ? type.toLowerCase() : undefined
    }
}

module.exports = Augment;