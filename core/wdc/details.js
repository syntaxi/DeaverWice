"use strict";
const {rollRandom, powerPerks, powerFlaws, lifePerks, lifeFlaws} = require("../../helpers.js");
const {detailsTypes, detailsTargets} = require('../../data/lookups.json');
const MessageHandler = require('../../messageHandler.js');
const DetailsTable = require("../../data/details.json");
const {RichEmbed} = require("discord.js");


class Details extends MessageHandler {
    constructor(bot) {
        super();
        this.bot = bot;
    }

    handle(msg, target, type) {
        if (target = Details.findTarget(target)) {
            if (type = Details.findType(type)) {
                Details.rollDetail(msg, target, type);
            } else {
                Details.sendOutput(msg, "Incorrect type of detail. Needs to be 'flaw' or 'perk'");
            }
        } else {
            Details.sendOutput(msg, "ERR: Somehow details has been called with no detail");
        }
    }

    static rollDetail(msg, target, type) {
        let roll;
        if (target === 'power') {
            roll = (type === 'flaw' && powerFlaws) || (type === 'perk' && powerPerks);
        } else if (target === 'life') {
            roll = (type === 'flaw' && lifeFlaws) || (type === 'perk' && lifePerks);
        } else {
            throw new SyntaxError("Target was not 'life' or 'power' but " + target)
        }

        /* Keep rolling until we get a valid option.
         * We can do this because all four options have at least one entry
         */
        const key = roll[rollRandom(Object.keys(roll))];
        const card = DetailsTable[key];

        Details.sendOutput(msg, Details.buildDetailEmbed(card[target][type], key));
    }

    static buildDetailEmbed(card, cardName) {
        return new RichEmbed()
            .setTitle(card.title)
            .setColor(0xFF0000)
            .setDescription([card.content + `\n\n_(Card: ${cardName}`] + ')_');
    }

    static findTarget(target) {
        target = target.toLowerCase();
        return target in detailsTargets ? detailsTargets[target] : undefined;
    }

    static findType(type) {
        type = type.toLowerCase();
        return type in detailsTypes ? detailsTypes[type] : undefined;

    }

}

module.exports = Details;