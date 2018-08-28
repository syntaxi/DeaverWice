"use strict";
const MessageReceiver = require('../framework/messageReceiver.js');

/**
 * Roleplay relate commands.
 * Calls on other files to implement complex commands.
 */
class Wdc extends MessageReceiver {
    constructor() {
        super();
        /* Scan for child files */
        this.prefix = "wd>";

        this.registerCommand('wound', 'wound.js');
        this.registerCommand('cut', Wdc.insertArgs('wound.js', 0, 'cut'));
        this.registerCommand('bash', Wdc.insertArgs('wound.js', 0, 'bash'));
        this.registerCommand('pierce', Wdc.insertArgs('wound.js', 0, 'pierce'));
        this.registerCommand('burn', Wdc.insertArgs('wound.js', 0, 'burn'));
        this.registerCommand('freeze', Wdc.insertArgs('wound.js', 0, 'freeze'));
        this.registerCommand('shock', Wdc.insertArgs('wound.js', 0, 'shock'));
        this.registerCommand('rend', Wdc.insertArgs('wound.js', 0, 'rend'));

        this.registerCommand('detail', 'detail.js');
        this.registerCommand('power', Wdc.insertArgs('detail.js', 0, 'power'));
        this.registerCommand('life', Wdc.insertArgs('detail.js', 0, 'life'));
        this.registerCommand('perk', Wdc.insertArgs('detail.js', 1, 'perk'));
        this.registerCommand('flaw', Wdc.insertArgs('detail.js', 1, 'flaw'));

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