"use strict";
const MessageHandler = require('../messageHandler.js');

/**
 * Roleplay relate commands.
 * Calls on other files to implement complex commands.
 */
class commands extends MessageHandler {
    constructor(bot) {
        /* Scan for child files */
        super(bot, __filename.slice(0, -3) + '/');

        this.bot = bot;
        this.prefix = "wd>";
        this.subFiles = {};
    }


    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {

        }
    }
}

module.exports = commands;