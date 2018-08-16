"use strict";
const MessageHandler = require('../messageHandler.js');

/**
 * Roleplay relate commands.
 * Calls on other files to implement complex commands.
 */
class Wdc extends MessageHandler {
    constructor(bot) {
        /* Scan for child files */
        super(bot, __filename.slice(0, -3) + '/');
        this.pruneHandlers();

        this.bot = bot;
        this.prefix = "wd>";

        this.registerCommand(['cut', 'c'], 'cut.js')
    }

    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {
            let args = msg.toString().split(/ +/g);
            if (args[0].toLowerCase() === this.prefix && args.length > 1) {
                this.handleCommand(msg, args[1], args.slice(2));
            }
        }
    }
}

module.exports = Wdc;