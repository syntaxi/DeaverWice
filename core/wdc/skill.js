"use strict";
const BasicScript = require('../../framework/basicScript.js');
const SkillsTable = require("../../data/skills.json");

const {titleCase, splitByLength} = require("../../helpers.js");
const {RichEmbed} = require("discord.js");

class Skill extends BasicScript {
    /**
     * Called when an associated key is triggered.
     *
     * @param msg The message that did the trigger
     * @param args The space separated arguments given to the command
     */
    handle(msg, ...args) {
        const name = args.join(" ").toLowerCase();
        let output = Skill.skillInfo(name) | "Unknown type or name " + name;
        Skill.sendOutput(msg, output);

    }

    static skillInfo(name) {
        /* Matches either nothing or `list/lists/all` caps insensitive */
        if (name.length === 0 || /^(lists?|all)$/i.test(name)) {
            return Skill.buildListingEmbed();
        } else if (Skill.isType(name)) {
            return Skill.buildTypeEmbed(name);
        } else if (Skill.isSkill(name)) {
            return Skill.buildNameEmbed(name);
        }
    }

    onBegin() {
        Skill.registerInfoFunction(Skill.skillInfo);
    }

    /**
     * Creates an embed containing information for the skills category.
     *
     * @returns {RichEmbed} The embed containing all the required info.
     */
    static buildListingEmbed() {
        const embed = new RichEmbed()
            .setTitle("Skills")
            .setDescription(SkillsTable.description[""]);
        for (let key in SkillsTable.description) {
            if (key !== "") {
                embed.addField(key, SkillsTable.description[key]);
            }
        }
        for (let type in SkillsTable.categories) {
            let contents = [];
            for (let i = 0; i < SkillsTable.categories[type].list.length; i++) {
                contents.push(`  ● ${titleCase(SkillsTable.categories[type].list[i])}`);
            }
            embed.addField(titleCase(type), contents.join("\n"), true);
        }
        /* Field only exists to correctly align the columns. Uses zero width spaces */
        embed.addField("​", "​", true);
        return embed;
    }

    /**
     * Creates an embed to display information about a skill category
     *
     * @param type The category to display
     * @returns {RichEmbed} The embed containing all the category info.
     */
    static buildTypeEmbed(type) {
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
        return embed;
    }

    /**
     * Builds an embed containing information on a skill.
     *
     * @param name The skill to build the embed for
     * @returns {RichEmbed} The embed created.
     */
    static buildNameEmbed(name) {
        const skill = SkillsTable.list[name];
        const embed = new RichEmbed()
            .setTitle(titleCase(name) + ` (${skill.stat})`)
            .setDescription(skill.description + `\n_(${titleCase(skill.category)} skill)_`);

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

        if ("misc" in skill) {
            for (let key in skill.misc) {
                embed.addField(titleCase(key), skill.misc[key])
            }
        }

        return embed;

    }

    /**
     * Checks if the given key is a valid category
     *
     * @param key The key to check
     * @returns {boolean} True, if it is a category. False otherwise
     */
    static isType(key) {
        return key in SkillsTable.categories;
    }

    /**
     * Checks if the given key is a skill name
     *
     * @param key The key to check
     * @returns {boolean} True if the key is a skill name. False otherwise.
     */
    static isSkill(key) {
        return key in SkillsTable.list;
    }
}

module.exports = Skill;