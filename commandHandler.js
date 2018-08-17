"use strict";
const MessageHandler = require("./messageHandler.js");

class CommandHandler extends MessageHandler {

    /**
     * Scans for files in the 'core' directory.
     * If found, it will require the file.
     *
     * The require should provide a class,
     * which will be constructed with `bot` as the sole parameter
     */
    constructor(bot) {
        super();
        console.log("Loading 'commandHandler.js'");
        this.handlers = CommandHandler.scanForFiles(bot, __dirname + "/core/");
        this.bot = bot;
        console.log();

        this.registerBot()
    }

    /**
     * Registers the message handlers on the core files.
     */
    registerBot() {
        for (let file in this.handlers) {
            console.log(`Registering ${file}`);

            for (let i = 0; i < CommandHandler.eventList.length; i++) {
                const eventName = CommandHandler.eventList[i];
                if (eventName in this.handlers[file]) {
                    this.bot.on(eventName, this.handlers[file][eventName].bind(this.handlers[file]));
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