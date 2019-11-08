"use strict";

const MessageReceiver = require("../framework/messageReceiver.js");
class Speaker extends MessageReceiver {
    constructor() {
        super();
        this.destTriggered = false;
        this.registerCommand("setdest", this.changeDest.bind(this));
    }



    changeDest() {
        this.destTriggered = true;
        //TODO implement
    }

    replicateMessage(msg){
        let guild = bot.guilds.find((guild, id) => id === "451318478062747669");
        let channel = guild.channels.find((guild, id) => id === "463972973712244737");
        channel.send(msg.content);
    }

    /**
     * Check if it's in the speaker channel, if so then duplicate it
     * If a match is found, calls the corresponding function.
     *
     * @param msg The message received
     */
    message(msg) {
        if (!msg.author.bot) {
            if (msg.channel.id === "642299584382500864") {
                // Message was sent in the right channel, let's do shit

                /* First try and handle the prefix case */
                this.destTriggered = false;
                super.message(msg);

                if (!this.destTriggered) {
                    //dest wasn't triggered so replicate it
                    this.replicateMessage(msg)
                }

            }
        }
    }



}
module.exports = Speaker;