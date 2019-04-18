"use strict";
const {splitByLength, wrapWithEndings} = require('../helpers.js');
const {getInstance} = require('./instanceManager.js');
const eventList = require("../data/eventList.json");

class BasicScript {
    constructor() {
        /* Load up instance methods */
        this.commands = {};
    }

    /**
     * Empty method. Should be overridden by child classes
     * This is called after all classes are loaded, but before the event handlers are registered
     */
    onBegin() {
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
     * The key can be:
     *      a string, which will be treated as a regex (case insensitive)
     *      a list, where each entry will be treated as a string key
     *
     * The func can be either be:
     *      a function, which will be directly linked to the key
     *      null, which will make it try and use a method of the same name on the instance
     *      a string, which will make it try and use a method of the same name on the instance. This must not terminate in `.js`
     *
     *      a class instance, which will have it's `handle` method linked
     *      a string (ending in `.js`), which denotes the sub file to get the class from. This must include the '.js'
     *
     * @param key The key(s) to link to
     * @param func The function, class or file to link to.
     * @param thisArg Optional argument to bind the function to
     */
    registerCommand(key, func, thisArg=this) {
        switch (typeof key) {
            case 'object': //- If we have passed in multiple keys -\\
                for (let item in key) {
                    if (key.hasOwnProperty(item) && typeof key[item] === "string") {
                        this.registerCommand(key[item], func)
                    }
                }
                break;
            case 'string':
                if (!func) { //- If the key is null, try and match it to a function based on the key -\\
                    func = key;
                }
                key = wrapWithEndings(key);
                switch (typeof func) {
                    case 'function': //- If it's a function, use that -\\
                        this.commands[key] = func.bind(thisArg);
                        break;
                    case 'string':
                        if (!func.endsWith(".js")) { //- Use a function of the same name -\\
                            if (func in this) {
                                this.commands[key] = this[func].bind(thisArg);
                            } else {
                                throw new Error(`Function '${func}' not found in class '${this.constructor.name}'`);
                            }
                            break;
                        } else { //- If it's a `.js` file use that instance -\\
                            func = getInstance(func);
                        }
                    //fallthrough if it's a js file
                    case 'object': //- If it's an object, pass over to the `handle` function on it -\\
                        if ('handle' in func) {
                            this.commands[key] = func.handle.bind(func);
                        } else {
                            throw new Error(`'handle' method not found in '${func}'`);
                        }
                        break;
                    default:
                        throw new Error(`Function '${typeof func}' is not a valid type`);
                }
                break;
            default:
                throw new Error("Key type not object or string");
        }
    }

    /**
     * Register the class to receive a discord.js event
     *
     * The key can be:
     *      a string, which will be treated as a regex (case insensitive)
     *      a list, where each entry will be treated as a string key
     *
     * The func can be either be:
     *      a function, which will be directly linked to the key
     *      null, which will make it try and use a method of the same name on the instance
     *      a string, which will make it try and use a method of the same name on the instance.
     *
     * @param key The key(s) to link to
     * @param func The function to link to
     */
    registerEvent(key, func) {
        switch (typeof key) {
            case 'object': //- If we have passed in multiple keys -\\
                for (let item in key) {
                    if (key.hasOwnProperty(item) && typeof key[item] === "string") {
                        this.registerCommand(key[item], func)
                    }
                }
                break;
            case 'string':
                if (!eventList.includes(key)) {
                    throw new Error(`${key} is not a valid event type`)
                }
                if (!func) { //- If the key is null, try and match it to a function based on the key -\\
                    func = key;
                }
                switch (typeof func) {
                    case 'function': //- If it's a function, use that -\\
                        bot.on(key, func.bind(this));
                        break;
                    case 'string': //- If it's a string, try and find a matching function -\\
                        if (func in this) {
                            bot.on(key, this[func].bind(this));
                        } else {
                            throw new Error(`Function '${func}' not found in class '${this.constructor.name}'`);
                        }
                        break;
                    default:
                        throw new Error(`Function '${typeof func}' is not a valid type`);
                }
                break;
            default:
                throw new Error("Key type not object or string");
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

    prependArgs(func, ...values) {
        return function (msg, ...args) {
            func.apply(this, [msg].concat(values, args))
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
            if (this.commands.hasOwnProperty(value) && key.match(value)) {
                this.commands[value].apply(null, args);
            }
        }
    }
}

BasicScript.bot = null;

module.exports = BasicScript;