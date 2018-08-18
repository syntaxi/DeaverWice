"use strict";
const {rollRandom, titleCase} = require("../../helpers.js");
const MessageHandler = require('../../messageHandler.js');
const {typeLookup} = require('../../data/lookups.json');
const AugmentsTable = require('../../data/augments.json');
const {RichEmbed} = require("discord.js");

class Augment extends MessageHandler {
    handle(msg, type) {
        if (type = Augment.getType(type)) {
            const key = rollRandom(Object.keys(AugmentsTable[type]));
            Augment.sendOutput(msg, Augment.buildAugmentEmbed(type, key));
        } else {
            Augment.sendOutput(msg, "Unknown power classification " + type)
        }
    }

    static getType(type) {
        return type && type.toLowerCase() in typeLookup ? type.toLowerCase() : undefined
    }

    static buildAugmentEmbed(type, key) {

        return new RichEmbed()
            .setTitle(titleCase(key))
            .setColor(0xFF0000)
            .setDescription(AugmentsTable[type][key].effect + `\n\n_(${titleCase(type)})_`);
    }
}

module.exports = Augment;