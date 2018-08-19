"use strict";
const {titleCase, invertedDetails} = require("../../helpers.js");
const MessageHandler = require('../../messageHandler.js');
const DetailsTable = require("../../data/details.json");
const AugmentsTable = require("../../data/augments.json");
const {buildDetailEmbed} = require('./detail.js');
const {buildAugmentEmbed} = require('./augment.js');
const Skill = require('./skill.js');
const {RichEmbed} = require("discord.js");

class Info extends MessageHandler {
    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        if (Info.tryDetails(msg, key)) {

        } else if (Info.tryAugments(msg, key)) {

        } else if (Info.trySkills(msg, key)) {

        } else {
            Info.sendOutput(msg, "I'm sorry, but I don't have info on that.");
        }
    }

    static tryDetails(msg, key) {
        if (key in DetailsTable) {
            const card = DetailsTable[key];
            let details = [];
            for (let target in card) {
                if (card.hasOwnProperty(target) && target !== 'description' && target !== 'image') {
                    for (let type in card[target]) {
                        if (card[target].hasOwnProperty(type)) {
                            details.push(`\t● ${target} ${type}: ${titleCase(key)}`)
                        }
                    }
                }
            }
            details = details.length === 0 ? "This card has no details" : details.join("\n");
            Info.sendOutput(msg, new RichEmbed()
                .setTitle(titleCase(key))
                .setImage(card.image)
                .setColor(0xFF0000)
                .setDescription(card.description)
                .addField("Details", details));
            return true;
        } else {
            for (let target in invertedDetails) {
                for (let type in invertedDetails[target]) {
                    if (key in invertedDetails[target][type]) {
                        const cardName = invertedDetails[target][type][key];
                        Info.sendOutput(
                            msg,
                            buildDetailEmbed(
                                DetailsTable[cardName][target][type],
                                invertedDetails[target][type][key]));
                        return true;
                    }
                }
            }
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

    static trySkills(msg, key) {
        if (key === 'skill' || key === 'skills') {
            Skill.handleListing(msg);
            return true
        }
        return Skill.handleName(msg, key) || Skill.handleType(msg, key);
    }

}

module.exports = Info;