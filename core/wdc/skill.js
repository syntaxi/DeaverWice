"use strict";
const {titleCase, splitByLength} = require("../../helpers.js");
const MessageHandler = require('../../messageHandler.js');
const SkillsTable = require("../../data/skills.json");
const {RichEmbed} = require("discord.js");

class Skill extends MessageHandler {

    handle(msg, ...args) {
        const name = args.join(" ").toLowerCase();
        if (name.length === 0) {
            Skill.handleListing(msg);
        } else if (!Skill.handleType(msg, name)
            && !Skill.handleName(msg, name)) {
            Skill.sendOutput(msg, "Unknown type or name " + name);
        }
    }

    static handleListing(msg) {
        const embed = new RichEmbed()
            .setTitle("Skills")
            .setDescription(SkillsTable.description[""]);
        for (let key in SkillsTable.description) {
            if (key !== "") {
                embed.addField(key, SkillsTable.description[key]);
            }
        }
        const types = [];
        for (let key in SkillsTable) {
            if (key !== "description") {
                types.push(titleCase(key))
            }
        }
        embed.addField("Types: ", types.join("\n"));
        Skill.replyOutput(msg, embed);
        return true;
    }

    static handleType(msg, type) {
        if (!Skill.isType(type)) {
            return false;
        }
        const embed = new RichEmbed()
            .setTitle(titleCase(type) + " Skills")
            .setDescription(SkillsTable[type].description);
        const skills = [];
        for (let key in SkillsTable[type]) {
            if (key !== "description") {
                skills.push(titleCase(key))
            }
        }
        embed.addField("Skills: ", skills.join("\n"));
        Skill.replyOutput(msg, embed);
        return true;
    }

    static handleName(msg, name) {
        for (let type in SkillsTable) {
            if (name in SkillsTable[type]) {
                const embed = Skill.buildNameEmbed(type, name);
                Skill.replyOutput(msg, embed);
                return true;
            }
        }
        return false;
    }

    static buildNameEmbed(type, name) {
        const skill = SkillsTable[type][name];
        const embed = new RichEmbed()
            .setTitle(titleCase(name) + ` (${skill.stat})`)
            .setDescription(skill.description + `\n_(${titleCase(type)} skill)_`);
        const levels = [];
        for (let i = 0; i < skill.levels.length; i++) {
            const lines = splitByLength(skill.levels[i], 49, 10);
            levels.push("```"
                + "●".repeat(i + 1)
                + " ".repeat(5 - i)
                + lines.join("\n" + " ".repeat(6))
                + "```");
        }
        embed.addField("Levels", levels[0]);
        for (let i = 1; i < levels.length; i++) {
            /* Title is a zero width space */
            embed.addField("​", levels[i]);
        }
        const specials = [];
        for (let special in skill.specialties) {
            specials.push(` ●  **${special}** -  ${skill.specialties[special]}`)
        }
        embed.addField("Specialties", specials.join("\n"));

        return embed;

    }

    static isType(key) {
        return key in SkillsTable;
    }


}

module.exports = Skill;