"use strict";
const Discord = require("discord.js");
const ScriptLoader = require("./framework/scriptLoader.js");

global.bot = new Discord.Client();
ScriptLoader.loadScripts(__dirname + "/core/");

bot.on('ready', () => console.log("Loading finished & Bot ready"));
bot.login(process.env.BOT_TOKEN);