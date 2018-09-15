"use strict";
const MessageReceiver = require("../framework/messageReceiver.js");
const MemeTable = require("../data/memes.json");
const {replaceJson} = require("../framework/jsonSaver.js");
const {getClass} = require("../framework/instanceManager.js");
const {wrapWithEndings} = require('../helpers.js');

/**
 * Contains memes and other joke commands
 */
class Meme extends MessageReceiver {
    constructor() {
        super();
        this.includes = {};
        this.equals = {};

        /* Load from json */
        for (let key in MemeTable.equals) {
            this.registerEquals(key, MemeTable.equals[key]);
        }
        for (let key in MemeTable.includes) {
            this.registerIncludes(key, MemeTable.includes[key]);
        }

        /* We can't load functions from JSON */
        this.registerEquals("what is my avatar", (msg) => Meme.sendOutput(msg, msg.author.avatarURL));
        this.registerEquals(/^(i'?m\s).{1,15}$/, Meme.dadJoke);

        this.registerCommand("gender", Meme.chooseGender);
        this.registerCommand("sex", Meme.chooseSex);
        
        this.registerCommand("listmemes", this.listmeme.bind(this));
        this.registerCommand("removememes", this.removememe.bind(this));
        this.registerCommand("addmemems", this.addmeme.bind(this));
    }


    /**
     * Register and output to be sent if the message contains the key.
     * If the output is a function, it is called. Otherwise the output is sent to the channel.
     *
     * The key and the message will both be converted to lower case.
     *
     * @param key The key to register with
     * @param output The output to use.
     */
    registerIncludes(key, output) {
        this.registerMeme(this.includes, key, output);
    }


    /**
     * Register an output to be sent if the message equals the key.
     * If the output is a function, that is called. Otherwise it is sent to the channel.
     *
     * The key and the message will both be converted to lower case.
     *
     * @param key The key to register with
     * @param output The output to send.
     */
    registerEquals(key, output) {
        this.registerMeme(this.equals, wrapWithEndings(key), output);
    }

    /**
     * Adds a meme to a given type.
     * If the output is a function, that is called. Otherwise it is sent to the channel.
     *
     * The key and the message will both be converted to lower case.
     *
     * @param type The type object to add it to.
     * @param key The key to register with
     * @param output The output to send.
     */
    registerMeme(type, key, output) {
        /* Only capitals in regex are ones representing actual capitals */
        key = key.toLowerCase();
        if (typeof output === "function") {
            type[key] = output;
        } else {
            type[key] = Meme.switchedSend.bind(this, output);
            if (output.length > 20) {
                type[key].output = output.substr(0, 20)
                    .replace("\n", "\\n") // Handle newlines
                    .replace("`", "``"); // Handle `
            } else {
                type[key].output = output;
            }
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
            /* Try and match it to an equals case */
            for (let key in this.equals) {
                if (msg.content.toLowerCase().match(key)) {
                    this.equals[key](msg);
                }
            }
            /* Try and match it to an includes case */
            for (let key in this.includes) {
                if (msg.content.toLowerCase().match(key)) {
                    this.includes[key](msg);
                }
            }
        }
    }

    /**
     * Called when a message equal to `wd>gender` is received
     *
     * @param msg
     */
    static chooseGender(msg) {
        let options = ["Male", "Female", "Trap"];
        let choice = Math.floor(Math.random() * options.length);
        Meme.sendOutput(msg, options[choice])
    }

    /**
     * Called when a message equal to `wd>sex` is received
     *
     * @param msg The message received.
     */
    static chooseSex(msg) {
        if (Math.random() < 0.3) {
            let options = ["Straight", "Gay", "Bi", "A", "*Clang! Clang!* you are Pansexual!", "Demi", "Poly", "Furry", "THE BIG GAY", "Homieflexual"];
            let choice = Math.floor(Math.random() * options.length);
            Meme.sendOutput(msg, options[choice]);
        } else {
            let options = ["Straight", "Trisexual"];
            let choice = Math.floor(Math.random() * options.length);
            Meme.sendOutput(msg, options[choice]);
        }
    }

    /**
     * Implements the classic dad joke format on a message:
     * Person: "I'm <x>"
     * Bot: "Hi <x>, I'm Dad!"
     * @param msg
     */
    static dadJoke(msg) {
        const size = msg.content.toLowerCase().match(/^(i'?m\s)./i)[1].length;
        Meme.sendOutput(msg, `Hi ${msg.toString().substr(size)}, I'm Dad!`);
    }

    /**
     * Adds a new meme
     *
     * @param msg The message that triggered it
     * @param type The type of meme to add
     * @param key The key that will trigger the meme. Regex is allowed.
     * @param value The value to output when the trigger is heard.
     */
    addmeme(msg, type, key, ...value) {
        if (!getClass("admin.js").verifyBotAdmin(msg.author, msg)) {
            Meme.sendOutput(msg, "You lack the required permissions >.>");
            return
        }
        if (value.length === 0) {
            Meme.sendOutput(msg, "Missing key, type and/or value");
            return
        }
        value = value.join(" ");
        /* Hacky, abuses switch case mechanics */
        switch (true) {
            case /^i(ncludes?)?$/i.test(type):
                this.registerIncludes(key, value);
                MemeTable.includes[key] = value;
                Meme.sendOutput(msg, `I will now respond with "${value} when it includes ${key}`);
                break;
            case /^e(quals?)?$/i.test(type):
                this.registerEquals(key, value);
                MemeTable.equals[key] = value;
                Meme.sendOutput(msg, `I will now respond with "${value} when I hear ${key} exactly`);
                break;
            default:
                Meme.sendOutput(msg, "Unknown register type " + type);
                return;
        }
        replaceJson("/data/memes.json", MemeTable);
    }

    /**
     * Removes a specific meme
     *
     * @param msg The message that triggered it
     * @param type The type of meme to remove
     * @param key The key of the meme to remove
     */
    removememe(msg, type, key) {
        if (!getClass("admin.js").verifyBotAdmin(msg.author, msg)) {
            Meme.sendOutput(msg, "You lack the required permissions >.>");
            return
        }
        if (!type || !key) {
            Meme.sendOutput(msg, "Missing key and/or value");
            return
        }
        key = wrapWithEndings(key);
        /* If we are removing an includes */
        if (/^i(ncludes?)?$/i.test(type) && key in this.includes) {
            delete this.includes[key];
            delete MemeTable.includes[key];
            Meme.sendOutput(msg, `I will no longer listen for messages containing ${key}`);
        } else if (/^e(quals?|xactly)?$/i.test(type) && key in this.equals) {
            delete this.equals[key];
            delete MemeTable.equals[key];
            Meme.sendOutput(msg, `I will no longer listen for ${key} exactly`);
        } else {
            Meme.sendOutput(msg, "Wrong value type or could not find key.");
            return;
        }
        replaceJson("/data/memes.json", MemeTable);
    }

    /**
     * Lists all the memes of a given type
     *
     * @param msg The message that triggered it
     * @param type The type of memes to list. Defaults to all
     */
    listmeme(msg, type) {
        if (!getClass("admin.js").verifyBotAdmin(msg.author, msg)) {
            Meme.sendOutput(msg, "You lack the required permissions >.>");
            return
        }
        let output = "";
        if (!type || /^(i(ncludes?)?|c(ontains?)?)$/i.test(type)) {
            output = (output ? output + "\n" : "");
            output += "Includes:\n" + Meme.collateMemes(this.includes);
        }
        if (!type || /^e(quals?|xactly)?$/i.test(type)) {
            output = output ? output + "\n" : "";
            output += "Equals:\n" + Meme.collateMemes(this.equals);
        }
        Meme.sendOutput(msg, output || "Wrong meme type. Try running with none to see all");
    }

    /**
     * Collects all the meme commands from the given object
     * Handles newline and grave cases
     *
     * @param type The object to get them from
     * @returns {string} A printable string of all the cases.
     */
    static collateMemes(type) {
        const lines = [];
        for (let key in type) {
            const func = type[key];
            lines.push(`  • \`"${
                key.replace("\n", "\\n")
                    .replace("`", "``")
                }"\` - \`"${
                func.name === "bound switchedSend" ?
                    func.output :
                    (`<Function ${func.name}` || '<Unknown Anonymous Function>')
                }\`"`);
        }
        return lines.join("\n");
    }
}

module.exports = Meme;
