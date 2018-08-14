const Discord = require('discord.js');
const Memes = require('./files/memes.js');
const Admin = require('./files/admin.js');
const Wdc = require('./files/wdc.js');
const bot = new Discord.Client();

/* Echo's */
Memes.registerBot(bot);
Admin.registerBot(bot);
Wdc.registerBot(bot);
bot.on('ready', function () {
    console.log('Ready');
});

bot.login(process.env.BOT_TOKEN);