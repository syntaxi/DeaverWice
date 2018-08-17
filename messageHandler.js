const fs = require("fs");
const path = require('path');

class MessageHandler {
    constructor(bot, path) {
        /* Re-assign console.log to add a tab at the start */
        let backupLog = console.log;
        console.log = function () {
            const par = Array.prototype.slice.call(arguments);
            par.unshift('\t');
            backupLog.apply(console, par)
        };

        this.handlers = {};
        if (fs.existsSync(path)) {
            console.log(`Scanning for files in ${path}`);
            let files = fs.readdirSync(path);
            for (let i = 0; i < files.length; i++) {
                try {
                    if (fs.lstatSync(path + files[i]).isFile()) {
                        console.log(`Loading '${files[i]}'`);
                        /* Slice 3 off the end to remove the suffix '.js' */
                        let handler = require(path + files[i]);
                        this.handlers[files[i]] = new handler(bot);
                    }
                } catch (e) {
                    console.log(`Failed loading of ${files[i]} got:\n\t${e}\nSkipping`)
                }
            }
            console.log(`Done scanning in ${path}`)
        } else {
            console.log(`${path} is not a valid path, refusing to scan`);
        }
        /* Undo the log re-assignment */
        console.log = backupLog;
    }

    /**
     * Sends some output to the channel a given message came from.
     * Handles splitting it up if it's too long.
     *
     * @param message The message to use to send the output.
     * @param value The output to send
     */
    static sendOutput(message, value) {
        MessageHandler.doOutput(message.channel.send.bind(message.channel), value);
    }

    static replyOutput(message, value) {
        MessageHandler.doOutput(message.reply.bind(message), value);
    }

    static doOutput(outFunc, value) {
        const messageSize = 2000 - 5;
        const maxBacktrack = 50;
        let i = 0;
        while (i + messageSize <= value.length) {
            let size = messageSize;
            while (value.charAt(i + size) !== " " && size > messageSize - maxBacktrack) {
                size--;
            }
            outFunc(value.substr(i, size) + "[...]");
            i += size;
        }
        outFunc(value.substring(i));
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
        this.commands = this.commands || {};
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
                        this.commands[key] = this.handlers[func].handle.bind(this.handlers[func]);
                        break;
                    default:
                        throw new SyntaxError("func type not class, function or string");
                }
                break;
            default:
                throw new SyntaxError("Key type not object or string");
        }
    }

    /**
     * Removes all handlers which don't have a `handle` method.
     */
    pruneHandlers() {
        for (let key in this.handlers) {
            if (!this.handlers[key].handle) {
                delete this.handlers[key];
                console.log(`Handler, '${key}.js', missing 'handle' function. Discarding.`)
            }
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

        /* Call the command, repeating if specified */
        if (key in this.commands) {
            this.commands[key].apply(this.commands[key], args);
        } else if (key in this) {
            this[key].apply(this, args);
        }
    }
}

module.exports = MessageHandler;