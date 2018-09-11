"use strict";
const BasicScript = require('../../framework/basicScript.js');
const AugmentsTable = require("../../data/augments.json");

const {getClass} = require('../../framework/instanceManager.js');

let buildAugmentEmbed, buildDetailEmbed, Skill, Stat;


class Info extends BasicScript {
    constructor() {
        super();
        this.infoFunctions = [];
    }

    onBegin() {
        Skill = getClass('skill.js');
        Stat = getClass('stat.js');
        buildAugmentEmbed = getClass('augment.js').buildAugmentEmbed;
        buildDetailEmbed = getClass('detail.js').buildDetailEmbed;
    }

    registerInfoFunction(func) {
        this.infoFunctions.push(func)
    }

    handle(msg, ...key) {
        key = key.join(' ').toLowerCase().trim();
        let result = false;
        for (let i = 0; i < this.infoFunctions; i++) {
            if (result = this.infoFunctions(key)) {
                Info.sendOutput(result);
            }
        }
        Info.sendOutput(msg, "I'm sorry, but I don't have info on that.");
    }
}

module.exports = Info;