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
    let channel = guild.channels.find((guild, id) => id === "463972973712244737");
    // channel.send("Bot Loaded");
}

bot.on('ready', printLoaded);


ScriptLoader.loadScripts(__dirname + "/core/")
    .then(() => {
            bot.login(process.env.BOT_TOKEN)
                .catch(reason => console.log("Failed to load bot:\n" + reason));
        }
    );
