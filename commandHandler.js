"use strict";
const fs = require('fs');

class CommandHandler {

    /**
     * Scans for files in the 'core' directory.
     * If found, it will require the file.
     *
     * The require should provide a class,
     * which will be constructed with `bot` as the sole parameter
     */
    constructor(bot) {
        const coreLoc = __dirname + "/core/";
        this.messages = [];
        this.bot = bot;

        console.log("Scanning for files");
        let files = fs.readdirSync(coreLoc);
        for (let i = 0; i < files.length; i++) {
            try {
                if (fs.lstatSync(coreLoc + files[i]).isFile()) {
                    this.messages[files[i]] = new (require(coreLoc + files[i]))(bot);
                }
            } catch (e) {
                console.log(`Failed loading of ${files[i]}, skipping...`)
            }
        }

        this.registerBot()
    }

    /**
     * Registers the message handlers on the core files.
     */
    registerBot() {
        for (let file in this.messages) {
            console.log(`Registering ${file}`);

            for (let i = 0; i < CommandHandler.eventList.length; i++) {
                const eventName = CommandHandler.eventList[i];
                if (eventName in this.messages[file]) {
                    this.bot.on(eventName, this.messages[file][eventName].bind(this.messages[file]));
                }
            }
        }
    }
}

CommandHandler.eventList = ["channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate",
    "clientUserGuildSettingsUpdate", "clientUserSettingsUpdate", "debug", "disconnect",
    "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove",
    "guildCreate", "guildDelete", "guildMemberAdd", "guildMemberAvailable",
    "guildMemberRemove", "guildMembersChunk", "guildMemberSpeaking", "guildMemberUpdate",
    "guildUnavailable", "guildUpdate", "message", "messageDelete", "messageDeleteBulk",
    "messageReactionAdd", "messageReactionRemove", "messageReactionRemoveAll",
    "messageUpdate", "presenceUpdate", "rateLimit", "ready", "reconnecting", "resume",
    "roleCreate", "roleDelete", "roleUpdate", "typingStart", "typingStop", "userNoteUpdate",
    "userUpdate", "voiceStateUpdate", "warn"];

module.exports = CommandHandler;