"use strict";
const {detailsTypes, detailsTargets} = require('../../data/lookups.json');
const DetailsTable = require("../../data/details.json");

const {rollRandom, invertedDetails} = require("../../helpers.js");
const BasicScript = require('../../framework/basicScript.js');
const {RichEmbed} = require("discord.js");
const {getInstance} = require('../../framework/instanceManager.js');


class Detail extends BasicScript {
    handle(msg, target, type, ...search) {
        search = search.join(" ").toLowerCase();
        if (target = Detail.findTarget(target)) {
            if (type = Detail.findType(type)) {
                if (search.length > 0) {
                    if (!getInstance("info.js").tryDetails()) {
                        Detail.sendOutput(msg, `Unable to find ${target} ${type}, ${search}`);
                    }
                } else {
                    Detail.rollDetail(msg, target, type);
                }
            } else {
                Detail.sendOutput(msg, "Incorrect type of detail.");
            }
        } else {
            Detail.sendOutput(msg, "Incorrect type of detail.");
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