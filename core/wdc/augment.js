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

    onBegin() {
        Augment.registerInfoFunction(Augment.augmentInfo);
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


    static augmentInfo(msg, key) {
        for (let type in AugmentsTable) {
            if (key in AugmentsTable[type]) {
                return Augment.buildAugmentEmbed(type, key);
            }
        }
    }
}

module.exports = Augment;