"use strict";
const MessageReceiver = require('../framework/messageReceiver.js');

/**
 * Roleplay relate commands.
 * Calls on other files to implement complex commands.
 */
class Wdc extends MessageReceiver {
    constructor() {
        super();

        this.registerCommand(/^wounds?$/, 'wound.js');
        this.registerCommand(/^cut$/, Wdc.insertArgs('wound.js', 0, 'cut'));
        this.registerCommand(/^bash$/, Wdc.insertArgs('wound.js', 0, 'bash'));
        this.registerCommand(/^pierce$/, Wdc.insertArgs('wound.js', 0, 'pierce'));
        this.registerCommand(/^burn$/, Wdc.insertArgs('wound.js', 0, 'burn'));
        this.registerCommand(/^freeze$/, Wdc.insertArgs('wound.js', 0, 'freeze'));
        this.registerCommand(/^shock$/, Wdc.insertArgs('wound.js', 0, 'shock'));
        this.registerCommand(/^rend$/, Wdc.insertArgs('wound.js', 0, 'rend'));

        this.registerCommand(/^details?$/, 'detail.js');
        this.registerCommand(/^power$/, Wdc.insertArgs('detail.js', 0, 'power'));
        this.registerCommand(/^life$/, Wdc.insertArgs('detail.js', 0, 'life'));
        this.registerCommand(/^perk$/, Wdc.insertArgs('detail.js', 1, 'perk'));
        this.registerCommand(/^flaw$/, Wdc.insertArgs('detail.js', 1, 'flaw'));

        this.registerCommand(/^info$/, 'info.js');

        this.registerCommand(/^aug(ment)?$/, 'augment.js');

        this.registerCommand(/^skills?$/, 'skill.js');

        this.registerCommand(/^stats?$/, 'stat.js');
        this.registerCommand(/^super(stats?)?$/, Wdc.insertArgs('stat.js', 0, 'superstat'));
    }
}

module.exports = Wdc;