"use strict";
const BasicScript = require('./basicScript.js');

class MessageReceiver extends BasicScript {
    constructor() {
        super();
        this.prefix = /^\s*(>?wd>?)/i;
        this.registerEvent("message");
    }

    /**
     * Default handler for the message event.
     * Simply splits it and calls handle command
     *
     * @param msg The triggering message
     */
    message(msg) {
        /* We don't reply to bots. */
        if (!msg.author.bot) {
            if (this.prefix.test(msg.content.toLowerCase())) {
                const args = msg.content
                    .toLowerCase()
                    .replace(this.prefix, "")
                    .trim()
                    .split(/\s+/g);
                if (args.length > 0) {
                    this.handleCommand(msg, args[0], args.slice(1));
                }
            }
        }
    }
}

module.exports = MessageReceiver;