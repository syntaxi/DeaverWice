"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
const {wonkyCase} = require("../helpers.js");
const {Permissions} = require("discord.js");
const BotAdmins = require("../data/botAdmins.json");
const {replaceJson} = require("../framework/jsonSaver.js");

class Admin extends MessageReceiver {
    constructor() {
        super();
        this.prefix = "wd>";
    }

    kick(msg, ...reason) {
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }
        const author = msg.guild.member(msg.author);
        reason = reason.slice(1).join(" ");
        const user = msg.mentions.users.first();
        /* Check if the author can ban people */
        if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (user) {
                reason = `${user.username} ${reason}`.trim();
            }
            Admin.replyOutput(msg, "wD> bAn " + wonkyCase(reason));
            return;
        }
        if (user) {
            const member = msg.guild.member(user);
            if (member) {
                member.ban({reason: reason})
                    .then(() => Admin.replyOutput(msg, `That boi got booted! YW bbygurl ${user.tag}`))
                    .catch(() => Admin.replyOutput(msg, "Uhhhh, Nope.\nsoz."));
            } else {
                Admin.replyOutput("That user is not on this server >.>");
            }
        } else {
            Admin.replyOutput(msg, "Whomst doth thee desire to kick?");
        }
    }

    ban(msg, ...reason) {
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }
        const author = msg.guild.member(msg.author);
        reason = reason.slice(1).join(" ");
        const user = msg.mentions.users.first();
        /* Check if the author can ban people */
        if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (user) {
                reason = `${user.username} ${reason}`.trim();
            }
            Admin.replyOutput(msg, "wD> bAn " + wonkyCase(reason));
            return;
        }
        /* The author can ban, so lets do that */
        if (user) {
            const member = msg.guild.member(user);
            if (member) {
                member.ban({reason: reason})
                    .then(() => Admin.replyOutput(msg, `That bitch empty, Yeet! ${user.tag}`))
                    .catch(() => Admin.replyOutput(msg, "Uhhhh, Nope.\nsoz."));
            } else {
                Admin.replyOutput("That user is not on this server >.>");
            }
        } else {
            Admin.replyOutput(msg, "Whomst doth thee desireth to ban?");
        }
    }

    addadmin(msg) {
        if (Admin.verifyBotAdmin(msg.author, msg)) {
            const user = msg.mentions.users.first();
            if (user) {
                if (user.id in BotAdmins || user.id === "478568562194251806") {
                    Admin.replyOutput(msg, "User is already a bot admin >.>");
                } else {
                    BotAdmins[user.id] = Object.keys(BotAdmins).length;
                    replaceJson("/data/botAdmins.json", BotAdmins);
                    Admin.replyOutput(msg, `Added ${user.toString()} to the list of Bot Admins`);
                }
            } else {
                Admin.replyOutput(msg, "You need to mention the person in the command");
            }
        }
    }

    static verifyBotAdmin(user, msg) {
        if (!(user.id in BotAdmins)) {
            if (msg) {
                Admin.replyOutput(msg, "*Tsk. Tsk. Tsk.* You aren't a bot admin.");
            }
            return false;
        }
        return true;
    }

    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {
            if (msg.content.toLowerCase().startsWith(this.prefix)) {
                const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
                if (args.length > 0) {
                    this.handleCommand(msg, args[0], args.slice(1));
                }
            }
        }
    }
}

module.exports = Admin;