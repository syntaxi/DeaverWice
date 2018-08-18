"use strict";
const {titleCase,powerPerks, powerFlaws, lifePerks, lifeFlaws} = require("../../helpers.js");
const MessageHandler = require('../../messageHandler.js');
const DetailsTable = require("../../data/details.json");
const {typeLookup} = require("../../data/lookups.json");
const AugmentsTable = require("../../data/augments.json");
const {buildDetailEmbed}= require('./details.js');
const {buildAugmentEmbed} = require('./augment.js');
const {RichEmbed} = require("discord.js");

class Info extends MessageHandler {
    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        if (Info.tryDetails(msg, key)) {

        } else if (Info.tryAugments(msg, key)) {

        } else {
            Info.sendOutput(msg, "I'm sorry, but I don't have info on that.");
        }
    }

    static tryDetails(msg, key) {
        if (key in DetailsTable) {
            const card = DetailsTable[key];
            let details = [];
            for (let target in card) {
                if (card.hasOwnProperty(target) && target !== 'description') {
                    for (let type in card[target]) {
                        if (card[target].hasOwnProperty(type)) {
                            details.push(`\t● ${target} ${type}: ${titleCase(card[target][type].title)}`)
                        }
                    }
                }
            }
            details = details.length === 0 ? "This card has no details" : details.join("\n");
            Info.sendOutput(msg, new RichEmbed()
                .setTitle(titleCase(key))
                .setColor(0xFF0000)
                .setDescription(card.description)
                .addField("Details", details));
            return true;
        } else if (key in powerPerks) {
            Info.sendOutput(
                msg,
                buildDetailEmbed(
                    DetailsTable[powerPerks[key]]['power']['perk'],
                    powerPerks[key]));
            return true;
        } else if (key in powerFlaws) {
            Info.sendOutput(
                msg,
                buildDetailEmbed(
                    DetailsTable[powerFlaws[key]]['power']['flaw'],
                    powerFlaws[key]));
            return true;
        } else if (key in lifePerks) {
            Info.sendOutput(
                msg,
                buildDetailEmbed(
                    DetailsTable[lifePerks[key]]['life']['perk'],
                    lifePerks[key]));
            return true;
        } else if (key in lifeFlaws) {
            Info.sendOutput(
                msg,
                buildDetailEmbed(
                    DetailsTable[lifeFlaws[key]]['life']['flaw'],
                    lifeFlaws[key]));
            return true;
        }
        return false;
    }

    static tryAugments(msg, key) {
        for (let type in AugmentsTable) {
            if (AugmentsTable.hasOwnProperty(type) && key in AugmentsTable[type]) {
                Info.sendOutput(msg, buildAugmentEmbed(type, key));
                return true;
            }
        }
    }

}

module.exports = Info;