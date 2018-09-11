"use strict";
const BasicScript = require('../../framework/basicScript.js');

class Info extends BasicScript {
    constructor() {
        super();
        this.infoFunctions = [];
    }

    /**
     * Register a new info function.
     * All info functions are called until one of them returns an embed.
     * If no functions returned an embed, a default message is shown.
     *
     * @param func The function to add
     */
    registerInfoFunction(func) {
        this.infoFunctions.push(func)
    }

    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        let result = false;
        for (let i = 0; i < this.infoFunctions.length; i++) {
            if (result = this.infoFunctions[i](key)) {
                Info.sendOutput(msg, result);
                return
            }
        }
        Info.sendOutput(msg, "I'm sorry, but I don't have info on that.");
    }
}

module.exports = Info;