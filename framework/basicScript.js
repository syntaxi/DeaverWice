"use strict";
const {splitByLength, wrapWithEndings} = require('../helpers.js');
const {getInstance} = require('./instanceManager.js');
const eventList = require("../data/eventList.json");

class BasicScript {
    constructor() {
        /* Load up instance methods */
        this.commands = {};
        const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(x => !eventList.includes(x));
        for (let i = 0; i < names.length; i++) {
            /* We add a $ and a ^ to make the name regex */
            this.commands[wrapWithEndings(names[i])] = this[names[i]];
        }
    }

    /**
     * Empty method. Should be overridden by child classes
     * This is called after all classes are loaded, but before the event handlers are registered
     */
    onBegin() {
    }

    /**
     * Short handler for registering an info func, so that the deriving class doesn't need to.
     * @param func The function to register
     */
    static registerInfoFunction(func) {
        getInstance('info.js').registerInfoFunction(func);
    }

    /**
     * Sends some output to the channel a given message came from.
     * Handles splitting it up if it's too long.
     *
     * @param message The message to use to send the output.
     * @param value The output to send
     */
    static sendOutput(message, value) {
        if (typeof value === 'string') {
            BasicScript.doOutput(message.channel.send.bind(message.channel), value);
        } else {
            message.channel.send(value);
        }
    }

    /**
     * Replies to the message that triggered the command.
     * Handles splitting it up if it's too long.
     *
     * @param message The message to use to send the output.
     * @param value The output to send
     */
    static replyOutput(message, value) {
        if (typeof value === 'string') {
            BasicScript.doOutput(message.reply.bind(message), value);
        } else {
            message.reply(value);
        }
    }


    /**
     * Output the content using the given output function.
     * Handles splitting if the output is larger than message limit
     *
     * @param outFunc The function to use to send the output.
     * @param value The output to send.
     */
    static doOutput(outFunc, value) {
        const lines = splitByLength(value, 2000 - 3, 50);
        for (let j = 0; j < lines.length - 1; j++) {
            outFunc(lines[j] + "[…]");
        }
        outFunc(lines[lines.length - 1]);
    }

    /**
     * Register a command to a given key.
     *
     * The key can be either a single string or an array of strings.
     * In the latter case, the function will be registered with all the keys
     *
     * The func can be either be:
     *      a function, which will be directly linked to the key
     *      a class instance, which will have it's `handle` method linked
     *      a string, which denotes the sub file to get the class from. This must include the '.js'
     *
     * @param key The key(s) to link to
     * @param func The function, class or file to link to.
     */
    registerCommand(key, func) {
        key = wrapWithEndings(key);
        switch (typeof key) {
            case 'object':
                for (let item in key) {
                    if (key.hasOwnProperty(item) && typeof key[item] === "string") {
                        this.registerCommand(key[item], func)
                    }
                }
                break;
            case 'string':
                switch (typeof func) {
                    case 'function':
                        this.commands[key] = func;
                        break;
                    case 'object':
                        this.commands[key] = func.handle.bind(func);
                        break;
                    case 'string':
                        this.commands[key] = getInstance(func).handle.bind(getInstance(func));
                        break;
                    default:
                        throw new SyntaxError(`Was not able to register key '${key}'.`);
                }
                break;
            default:
                throw new SyntaxError("Key type not object or string");
        }
    }

    /**
     * Adds values to the start of the argument list.
     *
     * @param file The name of the file to be called
     * @param pos The position to place the arguments
     * @param values The values to prepend
     * @returns {Function} A function with the given values prepended
     */
    static insertArgs(file, pos, ...values) {
        return (msg, ...args) => {
            getInstance(file).handle.apply(getInstance(file), [msg].concat(args.slice(0, pos), values, args.slice(pos)));
        }
    }

    /**
     * Handle choosing the correct child to send this command to.
     *
     * @param msg The triggering message
     * @param key The key to handle for
     * @param args The arguments of the command
     */
    handleCommand(msg, key, args) {
        /* The first parameter of a handle is always the message */
        args.unshift(msg);
        key = key.toLowerCase();

        /* Check in commands. This includes instance methods on the class */
        for (let value in this.commands) {
            if (key.match(value)) {
                this.commands[value].apply(this, args);
            }
        }
    }
}

module.exports = BasicScript;