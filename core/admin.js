"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
const {getInstance} = require("../framework/instanceManager.js");

const defaultRole = "abba";

class Admin extends MessageReceiver {
    constructor() {
        super();
        this.botRoles = {};
        this.registerCommand("kick");
        this.registerCommand("ban");
        this.registerCommand("(cuck|deny)", "deny");
        this.registerCommand("stop(cuck|deny)", "stopDeny");
        this.registerCommand("(silence|mute)", "silence");
        this.registerCommand("stop(silence|mute)", "stopDeny");
    }

    onBegin() {
        for (let guildId in bot.guilds) {
            this.botRoles[guildId] = [];
            for (let roleId in bot.guilds[guildId].roles.values()) {
                let role = bot.guilds[guildId].roles[roleId];
                if (role.name.toLowerCase() === defaultRole) {
                    this.botRoles[guildId].push(role.id);
                }
            }
        }
    }


    /**
     *  Checks if a given user in a guild can use the admin commands of the bot.
     *
     *  This is based firstly off if they have the default role,
     *  and secondly if they have administrator permissions.
     *
     *  This is specifically the administrator role option, rather than just having ban/kick perms
     *
     *
     * @param guild The guild the message was sent in
     * @param author The user to check the permissions for
     * @returns {boolean} True if the user is allowed to use the admin commands, false otherwise
     */
    hasAdminAbilities(guild, author) {
        let user = guild.fetchMember(author);
        if (guild.id in this.botRoles) {
            for (let roleId in user.roles) {
                if (roleId in this.botRoles[guild.id]
                    || user.role[roleId].hasPermission("ADMINISTRATOR")) {
                    return true;
                }
            }
        }
        /* Gives me super-admin perms */
        return author.id === "99372840192589824";
    }

    /**
     * Deletes a message in a channel, if it matches the id
     *
     * @param id The Id of the channel to stop
     * @param msg The message sent in the channel
     */
    doDenyChannel(id, msg) {
        if (msg.channel.id === id) {
            msg.delete();
        }
    }


    /**
     * Delete a message in a server if it matches the id
     *
     * @param id The id of the server being muted
     * @param msg The message sent in the server
     */
    doDenyGuild(id, msg) {
        if (msg.guild.id === id) {
            msg.delete();
        }
    }

    /**
     * Delete a message if it was sent by a specific user
     *
     * @param id The id of the user to deny
     * @param msg The message sent
     */
    doDenyUser(id, msg) {
        if (msg.author.id === id) {
            msg.delete();
        }
    }

    silence(msg, args) {
        /* Check if this command was used in a server */
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.replyOutput(msg, "No. Bad.\nStop.");
            return;
        }

        switch (args.toLowerCase()) {
            case "channel":
            case "this":
                getInstance("memes.js").registerMeme(".*", this.doDenyChannel.bind(this, msg.channel.id));
                break;
            case "all":
            case "server":
                getInstance("memes.js").registerMeme(".*", this.doDenyGuild.bind(this, msg.guild.id));
                break;
        }

    }

    deny(msg) {
        /* Check if this command was used in a server */
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.replyOutput(msg, "No. Bad.\nStop.");
            return;
        }

        /* Check if there is anyone mentioned */
        const user = msg.mentions.members.first();
        if (user) {
            getInstance("memes.js").registerMeme(".*", this.doDenyUser.bind(this, user.id));
        } else {
            Admin.sendOutput(msg, "Who do you want me to deny? _you?_")
        }
    }

    stopDeny(msg) {
        /* Check if this command was used in a server */
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.replyOutput(msg, "hue hue hue hue.");
            return;
        }

        getInstance("memes.js").removeMeme(".*");
    }

    kick(msg, reason) {
        /* Check if this command was used in a server */
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.replyOutput(msg, "You can't kick people...");
            Admin.sendOutput(msg, "did you really believe\n𝐢𝐭 𝐰𝐨𝐮𝐥𝐝 𝐛𝐞\n🅃🄷🄸🅂\n🅴🅰🆂🆈");
            return;
        }

        reason = `${msg.author.username}: ${reason}`.trim();

        /* Check if there is anyone to kick */
        const user = msg.mentions.members.first();
        if (user) {
            const member = msg.guild.member(user);
            if (member) {
                member.kick(reason)
                    .then(() => Admin.replyOutput(msg, `That boi got booted! YW bbygurl ${user.tag}`))
                    .catch(() => Admin.replyOutput(msg, "Uhhhh, Nope.\nsoz."));
            } else {
                Admin.replyOutput(msg, "... You can't kick someone that's not in the server..\nTbh I don't know how you did that")
            }
        } else {
            Admin.sendOutput(msg, "...\n..\nYou know you need to tell me who to kick right.")
        }
    }

    ban(msg, reason) {
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.replyOutput(msg, "You can't ban people...");
            Admin.sendOutput(msg, "did you really believe\n𝐢𝐭 𝐰𝐨𝐮𝐥𝐝 𝐛𝐞\n🅃🄷🄸🅂\n🅴🅰🆂🆈");
            return;
        }

        reason = `${msg.author.username}: ${reason}`.trim();

        /* Check if there is anyone to kick */
        const user = msg.mentions.members.first();
        if (user) {
            const member = msg.guild.member(user);
            if (member) {
                member.ban({reason: reason})
                    .then(() => Admin.replyOutput(msg, `oh dey gone hehehe. soz ${member.tag}`))
                    .catch(() => Admin.replyOutput(msg, "Uhhhh, Nope.\nsoz."));
            } else {
                Admin.replyOutput(msg, "... You can't ban someone that's not in the server..\nTbh I don't know how you did that")
            }
        } else {
            Admin.sendOutput(msg, "...\n..\nYou know you need to tell me who to ban right.")
        }
    }
}

module.exports = Admin;