"use strict";
const {statLookup} = require('../../data/lookups.json');
const StatTable = require('../../data/stats.json');

const BasicScript = require('../../framework/basicScript');
const {RichEmbed} = require("discord.js");
const {titleCase} = require("../../helpers.js");

class Stat extends BasicScript {
    handle(msg, type, superType) {
        let output = "Unknown stat/superstat type " + (superType || type);
        if (!type || /^all$|^lists?$/.test(type)) {
            output = Stat.buildStatInfoEmbed();

            // case where wd> superstat <type> is called
        } else if (/s(uper(stats?)?)?/.test(type) && superType
            && (superType = Stat.getSuperType(superType) || ("super" + Stat.getType(superType)))
            // case where wd> stat <superstat> is called
            || (superType = Stat.getSuperType(type))) {

            output = Stat.buildSuperstatEmbed(superType)

            // Case where wd> stat <type> is called
        } else if (type = Stat.getType(type)) {
            output = Stat.buildStatEmbed(type);
        }
        Stat.replyOutput(msg, output);
    }

    /**
     * Register the info function
     */
    onBegin() {
        Stat.registerInfoFunction(Stat.statInfo)
    }

    /**
     * Attempts to produce a Rich Embed, given the stat info
     * @param key The triggering key
     * @returns {RichEmbed} The rich embed, if one was made
     */
    static statInfo(key) {
        let type;
        if (type = Stat.getSuperType(key)) {
            return Stat.buildSuperstatEmbed(type);
        } else if (type = Stat.getType(key)) {
            return Stat.buildStatEmbed(type);
        } else if (/^(supers?)?stats?$/.test(key)) {
            return Stat.buildStatInfoEmbed();
        }
    }

    /**
     * Attempts to get the proper name of a stat.
     *
     * @param type The name to try and get
     * @returns {*} The proper name of the stat, or undefined
     */
    static getType(type) {
        return type && type.toLowerCase() in statLookup ? statLookup[type.toLowerCase()] : undefined
    }

    /**
     * Attempts to get the proper name of a superstat.
     * Valid names for a superstat are any of the valid stat names, with 'super' prepended.
     *
     * @param type The name to try and get
     * @returns {*} The proper name of the stat or undefined
     */
    static getSuperType(type) {
        if (type && /^s(uper)?/i.test(type)) {
            type = type.toLowerCase().replace(/^s(uper)?/, "");
            return type in statLookup ? "super" + statLookup[type] : undefined;
        } else {
            return undefined;
        }
    }

    /**
     * Builds an embed with information about stats in general
     * @returns {RichEmbed} The embed created
     */
    static buildStatInfoEmbed() {
        const embed = new RichEmbed()
            .setTitle("Stats")
            .setDescription(StatTable.description[""]);
        for (let key in StatTable.description) {
            if (key !== "") {
                embed.addField(key, StatTable.description[key])
            }
        }
        return embed
    }

    /**
     * Builds the data embed for a regular stat.
     *
     * @param type The stat type to build for
     * @returns {RichEmbed} The embed created
     */
    static buildStatEmbed(type) {
        const embed = new RichEmbed()
            .setTitle(titleCase(type))
            .setDescription(StatTable.stats[type][""]);
        for (let key in StatTable.stats[type]) {
            if (key !== "") {
                embed.addField(key, StatTable.stats[type][key])
            }
        }
        return embed
    }

    /**
     * Builds the data embed for a superstat.
     *
     * @param type The superstat type to build for
     * @returns {RichEmbed} The embed created
     */
    static buildSuperstatEmbed(type) {
        const embed = new RichEmbed()
            .setTitle(titleCase(type))
            .setDescription(StatTable.superstats[type][""]);
        for (let key in StatTable.superstats[type]) {
            if (key.length > 0) {
                embed.addField(key, StatTable.superstats[type][key]);
            }
        }
        return embed;
    }
}

module.exports = Stat;