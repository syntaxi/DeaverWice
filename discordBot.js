"use strict";
const Discord = require("discord.js");
const CommandHandler = require("./commandHandler.js");

const bot = new Discord.Client();

/* Echo's */
const handler = new CommandHandler(bot);
handler.registerBot(bot);

bot.on('ready', () => {
    console.log("Bot ready")
});

bot.login(process.env.BOT_TOKEN);