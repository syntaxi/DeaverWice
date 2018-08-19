"use strict";
const {rollRandom, invertedDetails} = require("../../helpers.js");
const {detailsTypes, detailsTargets} = require('../../data/lookups.json');
const MessageHandler = require('../../messageHandler.js');
const DetailsTable = require("../../data/details.json");
const {RichEmbed} = require("discord.js");


class Detail extends MessageHandler {
    constructor(bot) {
        super();
        this.bot = bot;
    }

    handle(msg, target, type) {
        if (target = Detail.findTarget(target)) {
            if (type = Detail.findType(type)) {
                Detail.rollDetail(msg, target, type);
            } else {
                Detail.sendOutput(msg, "Incorrect type of detail. Needs to be 'flaw' or 'perk'");
            }
        } else {
            Detail.sendOutput(msg, "ERR: Somehow details has been called with no detail");
        }
    }

    static rollDetail(msg, target, type) {
        const roll = invertedDetails[target][type];
        const key = roll[rollRandom(Object.keys(roll))];
        const card = DetailsTable[key];

        Detail.sendOutput(msg, Detail.buildDetailEmbed(card[target][type], key));
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

module.exports = Detail;