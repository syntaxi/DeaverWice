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

        this.bot = bot;
        this.prefix = "wd>";

        this.registerCommand('wound', 'wound.js', true);
        this.registerCommand('cut', this.getWoundFunc.bind(this,'cut'), true);
        this.registerCommand('bash', this.getWoundFunc.bind(this,'bash'), true);
        this.registerCommand('pierce', this.getWoundFunc.bind(this,'pierce'), true);
        this.registerCommand('burn', this.getWoundFunc.bind(this,'burn'), true);
        this.registerCommand('freeze', this.getWoundFunc.bind(this,'freeze'), true);
        this.registerCommand('shock', this.getWoundFunc.bind(this,'shock'), true);
        this.registerCommand(['rend'], this.getWoundFunc.bind(this,'rend'), true);
    }

    getWoundFunc(key, msg, ...args) {
        args.unshift(msg, key);
        this.handlers['wound.js'].handle.apply(this.handlers['wound.js'], args);
    }

    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {
            if (msg.content.toLowerCase().startsWith(this.prefix)) {
                const args = msg.content.slice(this.prefix.length).split(/ +/g);
                if (args.length > 0) {
                    this.handleCommand(msg, args[0], args.slice(1));
                }
            }
        }
    }
}

module.exports = Wdc;