"use strict";
const fs = require("fs");
const InstanceManager = require("./instanceManager.js");

/**
 * Specialised print function
 * This allows control for printing without a newline or any surrounding whitespace.
 *
 * @param message The message to print
 * @param format The formatting method to use
 */
function print(message, format) {
    format = format === undefined ? -2 : format;
    if (Math.abs(format) === 1) {
        message = message.trim();
    }
    process.stdout.write(message + (format >= 0 ? "" : "\n"));
}

/* Positive means no line */
/* 1 means no tab */
const PrintFormats = {
    NO_LINE: 2,
    NO_TAB: -1,
    NO_LINE_OR_TAB: 1,
    NORMAL: -2
};

class ScriptLoader {

    /**
     * Loads and begins scripts in the directory
     *
     * @param path The path to load in
     */
    static loadScripts(path) {
        ScriptLoader.scanForFiles(path);
        console.log("");
        return ScriptLoader.beginScripts().then(() => console.log("onBegin Finished\n"));
    }

    /**
     * Calls onBegin on all scripts and waits for them all to finish.
     *
     * Uses promises to allow for async & delayed operations in the onBegin
     */
    static beginScripts() {
        console.log(`Calling 'onBegin' on scripts. [${Object.keys(InstanceManager.getAll())}]`);
        let promises = [];
        for (let key in InstanceManager.getAll()) {
            try {
                let promise = Promise.resolve(InstanceManager.getInstance(key).onBegin())
                    .then(
                        () =>
                            console.log(`Completed beginning script ${key}`),
                        reason =>
                            console.log(`Failed to 'onBegin' ${key}. Got "${reason}"\nStackTrace:\n****\n${reason.stack}\n****`)
                    );
                promises.push(promise);
            } catch (reason) {
                console.log(`Unable to complete 'onBegin' for ${key}. Got "${reason}"\nStackTrace:\n****\n${reason.stack}\n****`)
            }
        }
        return Promise.all(promises);
    }

    /**
     * Recursively tries to load up scripts from within the core directory
     * This constructs and stores the instances.
     *
     * @param path The path to search down
     */
    static scanForFiles(path) {
        /* Re-assign console.log to add a tab at the start */
        let backupLog = print;
        print = function (message, format) {
            backupLog.call(null, '\t' + message, format);
        };

        if (fs.existsSync(path)) {
            print(`Scanning in ${path}`);
            let files = fs.readdirSync(path);
            for (let i = 0; i < files.length; i++) {
                try {
                    const fileStats = fs.lstatSync(path + files[i]);
                    if (fileStats.isFile()) {
                        print(`Loading "${files[i]}" `, PrintFormats.NO_LINE);
                        const clazz = require(path + files[i]);
                        InstanceManager.registerClass(files[i], new clazz());
                        print("✓", PrintFormats.NO_TAB);
                    } else if (fileStats.isDirectory()) {
                        print(`Found directory ${files[i]}`);
                        ScriptLoader.scanForFiles(`${path}${files[i]}/`);
                    }
                } catch (e) {
                    print("✗", PrintFormats.NO_TAB);
                    print(`• Failed loading of ${files[i]} got:`);
                    print("");
                    print(`${e.stack}`, PrintFormats.NO_TAB);
                    print("");
                    print(`• Skipping`);
                }
            }
            print(`Done scanning in ${path}`)
        } else {
            print(`${path} is not a valid path, refusing to scan`);
        }

        /* Undo the log re-assignment */
        print = backupLog;
    }
}

module.exports = ScriptLoader;