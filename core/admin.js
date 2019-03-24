"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
const {getInstance} = require("../framework/instanceManager.js");

const defaultRole = "abba";
const superAdmins = ["99372840192589824"];

class Admin extends MessageReceiver {
    constructor() {
        super();
        this.registerCommand("kick");
        this.registerCommand("ban");
        this.registerCommand("(cuck|deny)", "deny");
        this.registerCommand("stop(cuck|deny)", "stopDeny");
        this.registerCommand("(silence|mute)", "silence");
        this.registerCommand("stop(silence|mute)", "stopDeny");
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

    deny(msg) {
        let member = this.verifyMessage(msg, "deny");
        if (member) {
            getInstance("memes.js").registerMeme(".*", this.doDenyUser.bind(this, member.id));
            Admin.replyOutput(`${member.tag} has been forcibly silenced. :3`)
        }
    }

    kick(msg, reason) {
        let member = this.verifyMessage(msg, "kick");
        if (member) {
            member.kick(reason)
                .then(() => Admin.replyOutput(msg, `That boi got booted! YW bbygurl ${member.tag}`))
                .catch(() => Admin.replyOutput(msg, "... Sorry, I did my best."));
        }
    }

    ban(msg, reason) {
        let member = this.verifyMessage(msg, "ban");
        if (member) {
            member.ban({reason: reason})
                .then(() => Admin.replyOutput(msg, `oh dey gone hehehe. soz ${member.tag}`))
                .catch(() => Admin.replyOutput(msg, "I seem to be experiencing some difficulties with that..."));
        }
    }

    verifyMessage(msg, command) {
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.sendOutput(msg, `I'm sorry ${msg.author}, I'm afraid I can't do that.`);
            return;
        }
        let user = msg.mentions.members.first();
        if (user) {
            const member = msg.guild.member(user);
            if (!member) {
                Admin.replyOutput(msg, `... You can't ${command} someone that's not in the server..\nTbh I don't know how you did that`)
            }
        } else {
            Admin.replyOutput(msg, `darling. You do need to tell me who to ${command}`)
        }
        /* Check if there is anyone to kick */
        return msg.mentions.members.first();
    }

    /**
     *  Checks if a given user in a guild can use the admin commands of the bot.
     *
     *  This is based firstly off if they have the default role,
     *  and secondly if they are a super admin
     *
     *
     * @param guild The guild the message was sent in
     * @param author The user to check the permissions for
     * @returns {boolean} True if the user is allowed to use the admin commands, false otherwise
     */
    hasAdminAbilities(guild, author) {
        /* Check super-admin perms */
        if (superAdmins.includes(author.id)) {
            return true;
        }

        let user = guild.member(author);

        /* User is actually defined, because we set it in the promise
         * And wait for the promise to resolve */
        for (let role in user.roles.values()) {
            if (role.name.toLowerCase() === defaultRole) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Admin;