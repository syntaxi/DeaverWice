"use strict";
const Discord = require("discord.js");
const InstanceManager = require("./framework/instanceManager.js");
const ScriptLoader = require("./framework/scriptLoader.js");
const MessageReceiver = require("./framework/messageReceiver.js");
const eventList = ["channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate",
    "clientUserGuildSettingsUpdate", "clientUserSettingsUpdate", "debug", "disconnect",
    "emojiCreate", "emojiDelete", "emojiUpdate", "error", "guildBanAdd", "guildBanRemove",
    "guildCreate", "guildDelete", "guildMemberAdd", "guildMemberAvailable",
    "guildMemberRemove", "guildMembersChunk", "guildMemberSpeaking", "guildMemberUpdate",
    "guildUnavailable", "guildUpdate", "message", "messageDelete", "messageDeleteBulk",
    "messageReactionAdd", "messageReactionRemove", "messageReactionRemoveAll",
    "messageUpdate", "presenceUpdate", "rateLimit", "ready", "reconnecting", "resume",
    "roleCreate", "roleDelete", "roleUpdate", "typingStart", "typingStop", "userNoteUpdate",
    "userUpdate", "voiceStateUpdate", "warn"];

const bot = new Discord.Client();
ScriptLoader.loadScripts(__dirname + "/core/");

console.log("");

/* Register the events in to the MessageReceivers */
for (let file in InstanceManager.getAll()) {
    const instance = InstanceManager.getInstance(file);
    if (instance instanceof MessageReceiver) {
        console.log(`Registering handlers for ${file}`);
        for (let i = 0; i < eventList.length; i++) {
            const eventName = eventList[i];
            if (eventName in instance) {
                bot.on(eventName, instance[eventName].bind(instance));
            }
        }
    }
}


bot.on('ready', () => console.log("Loading finished & Bot ready"));
bot.login(process.env.BOT_TOKEN);