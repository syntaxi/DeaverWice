"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
const {wonkyCase} = require("../helpers.js");
const {Permissions} = require("discord.js");

class Admin extends MessageReceiver {
    constructor() {
        super();
        this.prefix = "wd>";
        this.registerCommand("kick", this.kick);
        this.registerCommand("ban", this.ban);
    }

    kick(msg, ...reason) {
        const author = msg.guild.member(msg.author);
        reason = reason.slice(1).join(" ");
        const user = msg.mentions.users.first();
        /* Check if the author can ban people */
        if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (user) {
                reason = `${user.username} ${reason}`.trim();
            }
            Admin.replyOutput(msg, "wD> bAn " + Admin.wonkyCase(reason));
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
        const author = msg.guild.member(msg.author);
        reason = reason.slice(1).join(" ");
        const user = msg.mentions.users.first();
        /* Check if the author can ban people */
        if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            if (user) {
                reason = `${user.username} ${reason}`.trim();
            }
            Admin.replyOutput(msg, "wD> bAn " + Admin.wonkyCase(reason));
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

    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot && msg.guild) {
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