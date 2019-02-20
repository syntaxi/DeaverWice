"use strict";
const MessageReceiver = require("../framework/messageReceiver.js");
const SheetsRequester = require("../framework/sheetsRequester");
const {wrapWithEndings} = require('../helpers.js');

function processMemeEntry(row) {
    if (row.length < 2 || !(row[0] && row[1])) {
        console.log("Unable to process row");
        return null;
    }
    return {
        key: row[0],
        response: row[1],
        isEquals: !!row[2],
        isRegex: !!row[3],
        isFunction: !!row[4]
    }
}

/**
 * Contains memes and other joke commands
 */
class Meme extends MessageReceiver {
    constructor() {
        super();
        this.memes = {};
        this.loadAllFromSheets();

        /* Things prefixed with `wd>` */
        this.registerCommand("gender", this.chooseGender);
        this.registerCommand("sex", this.chooseSex);
        this.registerCommand("reloadmemes", this.loadAllFromSheets.bind(this));
    }

    loadAllFromSheets(msg) {
        this.memes = {};
        if (msg) {
            Meme.sendOutput(msg, "Reloading memes daddy UwU");
        }
        SheetsRequester.getValues("memes").then(data => {
            for (let i = 0; i < data.length; i++) {
                let row = processMemeEntry(data[i]);
                if (row) {
                    if (row.isFunction) {
                        let func = this[row.response];
                        if (func && typeof func === "function") {
                            row.response = func.bind(this);
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
            }
        });
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
            if (this.prefix.test(msg.content)) {
                const args = msg.content
                    .replace(this.prefix, "")
                    .trim()
                    .split(/\s+/g);
                if (args.length > 0) {
                    this.handleCommand(msg, args[0].toLowerCase(), args.slice(1));
                    return;
                }
            }
            /* Try and match it to an meme */
            for (let key in this.memes) {
                if (msg.content.toLowerCase().match(key)) {
                    this.memes[key](msg);
                }
            }
        }
    }

    getAvatar(msg) {
        Meme.sendOutput(msg, msg.author.avatarURL);
    }

    /**
     * Called when a message equal to `wd>gender` is received
     *
     */
    chooseGender(msg) {
        let choice = Math.random();
        if (choice < .45) {
            Meme.sendOutput(msg, "Male")
        } else if (choice < .9) {
            Meme.sendOutput(msg, "Female")
        } else {
            Meme.sendOutput(msg, "Trap")
        }
    }

    /**
     * Called when a message equal to `wd>sex` is received
     *
     */
    chooseSex(msg) {
        let choice = Math.random();
        if (choice < .6) {
            Meme.sendOutput(msg, "Straight");
        } else {
            let options = ["Trisexual", "Gay", "Bi", "A", "*Clang! Clang!* you are Pansexual!", "Demi", "Poly", "Furry", "THE BIG GAY", "Homieflexual"];
            let choice = Math.floor(Math.random() * options.length);
            Meme.sendOutput(msg, options[choice]);
        }
    }

    /**
     * Implements the classic dad joke format on a message:
     * Person: "I'm <x>"
     * Bot: "Hi <x>, I'm Dad!"
     */
    dadJoke(msg) {
        const size = msg.content.toLowerCase().match(/^(i'?m\s)./i)[1].length;
        Meme.sendOutput(msg, `Hi ${msg.toString().substr(size)}, I'm Dad!`);
    }
}

module.exports = Meme;
