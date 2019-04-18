"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
const SheetsRequester = require("../framework/sheetsRequester");
const {RowEntry} = require('../framework/sheetEntries.js');
const {wrapWithEndings} = require('../helpers.js');

/**
 * @typedef {{
 *     key: String,
 *     response: String,
 *     isEquals: Boolean,
 *     isRegex: Boolean
 * }} UtilRow
 */
class UtilEntry extends RowEntry {
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
    }
}

/**
 * Handles misc capabilities of the bot.
 */
class Misc extends MessageReceiver {
    constructor() {
        super();
        this.registerCommand("reloadutils", this.loadAllFromSheets);
        this.registerCommand("gender", this.chooseGender);
        this.registerCommand("sex", this.chooseSex);
    }

    onBegin() {
        super.onBegin();
        return this.loadAllFromSheets();

    }

    loadAllFromSheets(msg) {
        if (msg) {
            Misc.sendOutput("Reloading util functions :D");
        }
        return SheetsRequester.getObjectTag(UtilEntry, "utils")
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    try {
                        /* This very bad. Need to not use this and investigate safe-eval options*/
                        row.response = new Function('msg', '...args', row.response); //EVAL IS EVIL
                    } catch (e) {
                        console.log(`Error in eval-ing for ${row.key}. Skipping`);
                        continue;
                    }
                    if (!row.isRegex) {
                        row.key = row.key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        row.key = row.key.replace(/\\\\n/g, '\n');
                    }
                    if (row.isEquals) {
                        row.key = wrapWithEndings(row.key);
                    }
                    this.registerCommand(row.key, row.response, EvalThis);
                }

            });
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
}

const EvalThis = {
    reply: Misc.replyOutput,
    send: Misc.sendOutput
};

module.exports = Misc;