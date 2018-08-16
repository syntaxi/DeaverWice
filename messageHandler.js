const fs = require("fs");
const path = require('path');

class handler {
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
                        this.handlers[files[i]] = new (require(path + files[i]))(bot);
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
     * @param value The output to send
     * @param message The message to use to send the output.
     */
    static sendOutput(value, message) {
        const messageSize = 2000 - 5;
        const maxBacktrack = 50;
        let i = 0;
        while (i + messageSize <= value.length) {
            let size = messageSize;
            while (value.charAt(i + size) !== " " && size > messageSize - maxBacktrack) {
                size--;
            }
            message.channel.send(value.substr(i, size) + "[...]");
            i += size;
        }
        message.channel.send(value.substring(i));
    }
}

module.exports = handler;