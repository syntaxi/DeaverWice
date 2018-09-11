"use strict";
const {detailsTypes, detailsTargets} = require('../../data/lookups.json');
const DetailsTable = require("../../data/details.json");

const {titleCase, rollRandom, invertedDetails} = require("../../helpers.js");
const BasicScript = require('../../framework/basicScript.js');
const {RichEmbed} = require("discord.js");


class Detail extends BasicScript {
    /**
     * Register the info function
     */
    onBegin() {
        Detail.registerInfoFunction(Detail.detailInfo)
    }

    handle(msg, target, type, ...search) {
        search = search.join(" ").toLowerCase();
        if (target = Detail.findTarget(target)) {
            if (type = Detail.findType(type)) {
                if (search.length > 0) {
                    const result = Detail.detailInfo(search);
                    Detail.sendOutput(msg, result || `Unable to find ${target} ${type}, ${search}`);

                } else {
                    Detail.rollDetail(msg, target, type);
                }
            } else {
                Detail.sendOutput(msg, "Incorrect type of detail.");
            }
        } else {
            Detail.sendOutput(msg, "Incorrect target of detail.");
        }
    }

    /**
     * Attempts to handle a request to display detail info
     * Tries to build a card or detail embed, if it can find a matching entry
     *
     * @param key The name of the info requested
     * @returns {RichEmbed}
     */
    static detailInfo(key) {
        if (key in DetailsTable) {
            return Detail.buildCardEmbed(DetailsTable[key]);
        } else {
            for (let target in invertedDetails) {
                for (let type in invertedDetails[target]) {
                    if (key in invertedDetails[target][type]) {
                        const cardName = invertedDetails[target][type][key];
                        return Detail.buildDetailEmbed(
                            DetailsTable[cardName][target][type],
                            invertedDetails[target][type][key]);
                    }
                }
            }
        }
    }

    /**
     * Builds a rich embed for the given detail.
     *
     * @param detail The detail to display
     * @param cardName The name of the card the detail belongs to
     * @returns {RichEmbed} The newly created embed
     */
    static buildDetailEmbed(detail, cardName) {
        return new RichEmbed()
            .setTitle(detail.title)
            .setColor(0xFF0000)
            .setDescription([detail.content + `\n\n_(Card: ${cardName}`] + ')_');
    }

    /**
     * Builds a rich embed for the given card.
     *
     * @param card The card to build the embed for
     * @returns {RichEmbed} The newly created embed
     */
    static buildCardEmbed(card) {
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
    }

    /**
     * Randomly selects a new embed given the target and type.
     *
     * @param msg The triggering message
     * @param target Either 'life' or 'power'
     * @param type Either 'perk' or 'flaw'
     */
    static rollDetail(msg, target, type) {
        const roll = invertedDetails[target][type];
        const key = roll[rollRandom(Object.keys(roll))];
        const card = DetailsTable[key];

        Detail.sendOutput(msg, Detail.buildDetailEmbed(card[target][type], key));
    }

    /**
     * Tries to convert the given name into a correct target
     *
     * @param target The name to try and convert
     * @returns {*} The proper name if it could be converted, undefined otherwise.
     */
    static findTarget(target) {
        target = target.toLowerCase();
        return target in detailsTargets ? detailsTargets[target] : undefined;
    }

    /**
     * Tries to convert the given name in a correct type.
     *
     * @param type The name to try and convert
     * @returns {*} The proper name if it could be converted, undefined otherwise.
     */
    static findType(type) {
        type = type.toLowerCase();
        return type in detailsTypes ? detailsTypes[type] : undefined;

    }
}

module.exports = Detail;