"use strict";
const fs = require("fs");
const InstanceManager = require('./instanceManager.js');

function print(message, noLine, noTab) {
    if (noTab) {
        message = message.trim();
    }
    process.stdout.write(message + (noLine ? "" : "\n"));
}

class ScriptLoader {

    static loadScripts(path) {
        ScriptLoader.scanForFiles(path);
        console.log("Calling 'onBegin' on scripts");
        for (let key in InstanceManager.getAll()) {
            try {
                InstanceManager.getInstance(key).onBegin();
            } catch (e) {
                console.log(`Failed to 'onBegin' ${key}. Got "${e}"`);
            }
        }
        console.log("Finished onBegin")
    }

    static scanForFiles(path) {
        /* Re-assign console.log to add a tab at the start */
        let backupLog = print;
        print = function (message, noLine, noTab) {
            backupLog.call(null, '\t' + message, noLine, noTab);
        };

        if (fs.existsSync(path)) {
            print(`Scanning in ${path}`);
            let files = fs.readdirSync(path);
            for (let i = 0; i < files.length; i++) {
                try {
                    const fileStats = fs.lstatSync(path + files[i]);
                    if (fileStats.isFile()) {
                        print(`Loading "${files[i]}" `, true);
                        InstanceManager.registerClass(files[i], new (require(path + files[i]))());
                        print("✓", false, true);
                    } else if (fileStats.isDirectory()) {
                        print(`Found directory ${files[i]}`);
                        ScriptLoader.scanForFiles(`${path}${files[i]}/`);
                    }
                } catch (e) {
                    print("✗", false, true);
                    print(`• Failed loading of ${files[i]} got:`);
                    print(`• "${e}"`);
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