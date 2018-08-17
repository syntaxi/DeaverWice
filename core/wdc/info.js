"use strict";
const {titleCase,powerPerks, powerFlaws, lifePerks, lifeFlaws} = require("../../helpers.js");
const MessageHandler = require('../../messageHandler.js');
const DetailsTable = require("../../data/details.json");
const Details = require('./details.js');
const {RichEmbed} = require("discord.js");

class Info extends MessageHandler {
    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        if (this.tryPerks(msg, key)) {

        } else {
            Info.sendOutput(msg, "I'm sorry, but I don't have info on that.");
        }
    }

    tryPerks(msg, key) {
        let success = false;

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
                Details.buildDetailEmbed(
                    DetailsTable[powerPerks[key]]['power']['perk'],
                    powerPerks[key]));
            return true;
        } else if (key in powerFlaws) {
            Info.sendOutput(
                msg,
                Details.buildDetailEmbed(
                    DetailsTable[powerFlaws[key]]['power']['flaw'],
                    powerFlaws[key]));
            return true;
        } else if (key in lifePerks) {
            Info.sendOutput(
                msg,
                Details.buildDetailEmbed(
                    DetailsTable[lifePerks[key]]['life']['perk'],
                    lifePerks[key]));
            return true;
        } else if (key in lifeFlaws) {
            Info.sendOutput(
                msg,
                Details.buildDetailEmbed(
                    DetailsTable[lifeFlaws[key]]['life']['flaw'],
                    lifeFlaws[key]));
            return true;
        }

        return success;
    }

}

module.exports = Info;