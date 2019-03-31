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

    silence(msg, args) {
        if (this.verifyMessage(msg)) {
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

    }

    stopDeny(msg) {
        if (this.verifyMessage(msg)) {
            getInstance("memes.js").removeMeme(".*");
            Admin.replyOutput(msg, `The silence has been lifted`)
        }
    }

    deny(msg) {
        let allowed = this.verifyMessage(msg);
        let member = this.findUser(msg, "deny");
        if (allowed && member) {
            getInstance("memes.js").registerMeme(".*", this.doDenyUser.bind(this, member.id));
            Admin.replyOutput(msg, `${member.tag} has been forcibly silenced. :3`)
        }
    }

    kick(msg, reason) {
        let allowed = this.verifyMessage(msg);
        let member = this.findUser(msg, "kick");
        if (allowed && member) {
            member.kick(reason)
                .then(() => Admin.replyOutput(msg, `That boi got booted! YW bbygurl ${member.tag}`))
                .catch(() => Admin.replyOutput(msg, "... Sorry, I did my best, but I still wasn't able to"));
        }
    }

    ban(msg, reason) {
        let allowed = this.verifyMessage(msg);
        let member = this.findUser(msg, "ban");
        if (allowed && member) {
            member.ban({reason: reason})
                .then(() => Admin.replyOutput(msg, `oh dey gone hehehe. soz ${member.tag}`))
                .catch(() => Admin.replyOutput(msg, "I seem to be experiencing some difficulties with that..."));
        }
    }

    /**
     * Checks if the message is valid to trigger and admin command (both author and message are checked)
     * @param msg The triggering message
     * @return {boolean} True if they can use them, false otherwise
     */
    verifyMessage(msg) {
        /* Check sent location */
        if (!msg.guild) {
            Admin.replyOutput(msg, "This command must be used in an guild");
            return false;
        }

        /* Check if the user has perms */
        if (!this.hasAdminAbilities(msg.guild, msg.author)) {
            Admin.sendOutput(msg, `I'm sorry ${msg.author}, I'm afraid I can't do that.`);
            return false;
        }
        return true;
    }

    /**
     * Finds the first user mentioned in a message. Returns false if none was found
     *
     * Displays error messages in the chat if nobody could be found in the message or in the server
     *
     * @param msg The message to find the user in
     * @param command The command trying to be run
     * @return {boolean|User} The user if one could be found, false otherwise
     */
    findUser(msg, command) {
        /* Find the mentioned user */
        let user = msg.mentions.members.first();
        if (user) {
            const member = msg.guild.member(user);
            if (!member) {
                Admin.replyOutput(msg, `... You can't ${command} someone that's not in the server..\nTbh I don't know how you did that`)
                return false;
            }
            return member;
        } else {
            Admin.replyOutput(msg, `darling. You do need to tell me who to ${command}`);
            return false;
        }
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
        for (let role of user.roles.values()) {
            if (role.name.toLowerCase() === defaultRole) {
                return true;
            }
        }
        return false;
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
}

module.exports = Admin;