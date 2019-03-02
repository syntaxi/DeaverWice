"use strict";
const Discord = require("discord.js");
const ScriptLoader = require("./framework/scriptLoader.js");

global.bot = new Discord.Client();
ScriptLoader.loadScripts(__dirname + "/core/");

function printLoaded(bot) {
    let guild = bot.guilds.find((guild, id)=>id==="451318478062747669");
    let channel = guild.channels.find((guild, id)=>id==="463972973712244737");
    channel.send("Bot Loaded");
}

bot.on('ready', () => {
    console.log("Loading finished & Bot ready");
    printLoaded(bot);
});

bot.login(process.env.BOT_TOKEN);