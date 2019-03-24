"use strict";
const Discord = require("discord.js");
const ScriptLoader = require("./framework/scriptLoader.js");
global.Promise = require("bluebird");
Promise.config({
    longStackTraces: true
});

global.bot = new Discord.Client();

/* Prints that the bot was reloaded */
function printLoaded() {
    console.log("Loading finished & Bot ready");

    let guild = bot.guilds.find((guild, id) => id === "451318478062747669");
    let channel = guild.channels.find((guild, id) => id === "451318752378880000");
    channel.send("Bot Loaded");
}

bot.login(process.env.BOT_TOKEN)
    .then(() => ScriptLoader.loadScripts(__dirname + "/core/"))
    .then(printLoaded)
    .catch(reason => console.log("Failed to load bot:\n" + reason));
