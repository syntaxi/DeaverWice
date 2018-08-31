"use strict";
const BasicScript = require('../../framework/basicScript.js');
const DetailsTable = require("../../data/details.json");
const AugmentsTable = require("../../data/augments.json");

const {RichEmbed} = require('discord.js');
const {titleCase, invertedDetails} = require("../../helpers.js");
const {getClass} = require('../../framework/instanceManager.js');

let buildAugmentEmbed, buildDetailEmbed, Skill, Stat;


class Info extends BasicScript {
    onBegin() {
        Skill = getClass('skill.js');
        Stat = getClass('stat.js');
        buildAugmentEmbed = getClass('augment.js').buildAugmentEmbed;
        buildDetailEmbed = getClass('detail.js').buildDetailEmbed;
    }

    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        let output;
        if (output = (Info.tryDetails(msg, key)
            || Info.tryAugments(msg, key)
            || Info.trySkills(msg, key)
            || Info.tryStats(msg, key))) {
            Info.sendOutput(msg, output);
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
            return new RichEmbed()
                .setTitle(titleCase(key))
                .setImage(card.image)
                .setColor(0xFF0000)
                .setDescription(card.description)
                .addField("Details", details);
        } else {
            for (let target in invertedDetails) {
                for (let type in invertedDetails[target]) {
                    if (key in invertedDetails[target][type]) {
                        const cardName = invertedDetails[target][type][key];
                        return buildDetailEmbed(
                            DetailsTable[cardName][target][type],
                            invertedDetails[target][type][key]);
                    }
                }
            }
        }
    }

    static tryAugments(msg, key) {
        for (let type in AugmentsTable) {
            if (AugmentsTable.hasOwnProperty(type) && key in AugmentsTable[type]) {
                return buildAugmentEmbed(type, key);
            }
        }
    }

    static trySkills(msg, key) {
        if (/skills?/.test(key)) {
            return Skill.buildListingEmbed();
        } else if (Skill.isType(key)) {
            return Skill.buildTypeEmbed(key);
        } else if (Skill.isSkill(key)) {
            return Skill.buildNameEmbed(key);
        }
    }

    static tryStats(msg, key) {
        let type;
        if (type = Stat.getSuperType(key)) {
            return Stat.buildSuperstatEmbed(type);
        } else if (type = Stat.getType(key)) {
            return Stat.buildStatEmbed(type);
        } else if (/^(super)?stats?$/.test(key)) {
            return Stat.buildStatInfoEmbed();
        }
    }
}

module.exports = Info;