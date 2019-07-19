"use strict";
const MessageReceiver = require("../framework/messageReceiver.js");
const SheetsRequester = require("../framework/sheetsRequester");
const {wrapWithEndings} = require('../helpers.js');
const {RowEntry} = require('../framework/sheetEntries.js');

/**
 * The definition of how a meme is stored
 *
 * @typedef {{
 *      key: String,
 *      response: String,
 *      isEquals: Boolean,
 *      isRegex: Boolean,
 *      isFunction: Boolean
 * }} MemeType
 */
class MemeEntry extends RowEntry {
    /**
     * @param data {MemeType}
     */
    static verifyRow(data) {
        return data.key && data.response
    }

    static newRow(obj, data) {
        obj.key = data[0].toString();
        obj.response = data[1].toString();
        obj.isEquals = !!data[2];
        obj.isRegex = !!data[3];
        obj.isFunction = !!data[4];
    }
}

/**
 * Contains memes and other joke commands
 */
class Meme extends MessageReceiver {
    constructor() {
        super();
        this.memes = {};
        this.registerCommand("reloadmemes", this.loadAllFromSheets.bind(this));
    }

    onBegin() {
        super.onBegin();
        return this.loadAllFromSheets();
    }


    loadAllFromSheets(msg) {
        this.memes = {};
        if (msg) {
            Meme.sendOutput(msg, "Reloading memes daddy UwU");
        }
        return SheetsRequester.getObjectTag(MemeEntry, "memes")
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    if (row.isFunction) {
                        if (row.response in this) {
                            row.response = this[row.response].bind(this);
                        } else {
                            console.log("No function " + row.response);
                            continue;
                        }
                    }
                    if (!row.isRegex) {
                        row.key = row.key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        row.key = row.key.replace(/\\\\n/g, '\n');
                    }
                    if (row.isEquals) {
                        row.key = wrapWithEndings(row.key);
                    }
                    this.registerMeme(row.key, row.response);
                }

            });
    }

    removeMeme(key) {
        if (key in this.memes) {
            delete this.memes[key];
        }
    }

    deleteMessage(msg) {
        setTimeout(() => msg.delete(), 100);
    }


    /**
     * Adds a meme to a given type.
     * If the output is a function, that is called. Otherwise it is sent to the channel.
     *
     * The key and the message will both be converted to lower case.
     *
     * @param key The key to register with
     * @param output The output to send.
     */
    registerMeme(key, output) {
        if (typeof output === "function") {
            this.memes[key] = output;
        } else {
            this.memes[key] = Meme.switchedSend.bind(this, output);
        }
    }

    /**
     * Alternate form of send, which handles message being the second element
     * @param output The output to send.
     * @param msg The message to use to send it.
     */
    static switchedSend(output, msg) {
        Meme.sendOutput(msg, output)
    }

    /**
     * Check through all the bound values to see if any match.
     * If a match is found, calls the corresponding function.
     *
     * @param msg The message received
     */
    message(msg) {
        if (!msg.author.bot) {
            /* First try and handle the prefix case */
            super.message(msg);

            /* Try and match it to an meme */
            for (let key in this.memes) {
                if (msg.content.toLowerCase().match(key)) {
                    this.memes[key](msg);
                }
            }
        }
    }

    /**
     * Implements the classic dad joke format on a message:
     * Person: "I'm <x>"
     * Bot: "Hi <x>, I'm Dad!"
     *
     * Only happens every 1/5 times
     *
     * We want to also always reply to a specific person (and say daddy instead)
     */
    dadJoke(msg) {
        if (Math.random() < 0.2 || msg.author.id === "287287897336446976") {
            const size = msg.content.toLowerCase().match(/^(i'?m\s)./i)[1].length;
            Meme.sendOutput(msg, `Hi ${msg.toString().substr(size)}, I'm Dad${msg.author.id === "287287897336446976" ? "dy" : ""}!`);
        }
    }
}

module.exports = Meme;
