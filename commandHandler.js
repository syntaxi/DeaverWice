"use strict";
const fs = require('fs');

class CommandHandler {

    constructor() {
        const coreLoc = "./core/";
        this.messages = [];
        console.log("Scanning for files");
        let files = fs.readdirSync(coreLoc);
        for (let i = 0; i < files.length; i++) {
            try {
                if (fs.lstatSync(coreLoc + files[i]).isFile()) {
                    this.messages[files[i]] = require(coreLoc + files[i]);
                }
            } catch (e) {
                console.log(`Failed loading of ${files[i]}, skipping...`)
            }
        }
    }

    registerBot(bot) {
        for (let file in this.messages) {
            console.log(`Registering ${file}`);
            this.messages[file] = new this.messages[file]();
            for (let i = 0; i < CommandHandler.eventList.length; i++) {
                const eventName = CommandHandler.eventList[i];
                if (eventName in this.messages[file]) {
                    bot.on(eventName, this.messages[file][eventName])
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