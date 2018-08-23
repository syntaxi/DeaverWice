"use strict";
const MessageHandler = require('../messageHandler.js');

/**
 * Roleplay relate commands.
 * Calls on other files to implement complex commands.
 */
class Wdc extends MessageHandler {
    constructor(bot) {
        super();
        /* Scan for child files */
        this.handlers = Wdc.scanForFiles(bot, __filename.slice(0, -3) + '/');
        this.bot = bot;
        this.prefix = "wd>";

        this.registerCommand('wound', 'wound.js');
        this.registerCommand('cut', this.prefixWith('wound.js', 'cut'));
        this.registerCommand('bash', this.prefixWith('wound.js', 'bash'));
        this.registerCommand('pierce', this.prefixWith('wound.js', 'pierce'));
        this.registerCommand('burn', this.prefixWith('wound.js', 'burn'));
        this.registerCommand('freeze', this.prefixWith('wound.js', 'freeze'));
        this.registerCommand('shock', this.prefixWith('wound.js', 'shock'));
        this.registerCommand('rend', this.prefixWith('wound.js', 'rend'));

        this.registerCommand('detail', 'detail.js');
        this.registerCommand('power', this.prefixWith('detail.js', 'power'));
        this.registerCommand('life', this.prefixWith('detail.js', 'life'));
        this.registerCommand('perk', (msg, ...args) => {
            this.handlers['detail.js'].handle.apply(this.handlers['detail.js'], [msg].concat(args[0], ['perk'], args.slice(1)));
        });
        this.registerCommand('flaw', (msg, ...args) => {
            this.handlers['detail.js'].handle.apply(this.handlers['detail.js'], [msg].concat(args[0], ['flaw'], args.slice(1)));
        });

        this.registerCommand('info', 'info.js');

        this.registerCommand('aug', 'augment.js');
        this.registerCommand('augment', 'augment.js');

        this.registerCommand('skill', 'skill.js');
        this.registerCommand('skills', 'skill.js');
    }

    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {
            if (msg.content.toLowerCase().startsWith(this.prefix)) {
                const args = msg.content.slice(this.prefix.length).trim().split(/ +/g);
                if (args.length > 0) {
                    this.handleCommand(msg, args[0], args.slice(1));
                }
            }
        }
    }
}

module.exports = Wdc;