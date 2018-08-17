"use strict";
const MessageHandler = require("../messageHandler.js");

/**
 * Contains memes and other joke commands
 */
class Memes extends MessageHandler {
    constructor(bot) {
        super();
        this.bot = bot;
        this.includes = {};
        this.equals = {};

        this.registerEquals("friskyfoxx", "Don't you mean... Mother?");
        this.registerEquals("wd>help", "No.");
        this.registerEquals("what is my avatar", (msg) => Memes.sendOutput(msg, msg.author.avatarURL));
        this.registerEquals("wd>gender", Memes.chooseGender);
        this.registerEquals("wd>sex", Memes.chooseSex);
        this.registerEquals("nice", "join");
        this.registerEquals("Look at them,", "they come to this place when they know they are not pure. Tenno use the keys, but they are mere trespassers." +
            " Only I, Vor, know the true power of the Void. I was cut in half, destroyed, but through it's Janus Key, the Void called to me." +
            " It brought me here and here I was reborn. We cannot blame these creatures, they are being led by a false prophet, an impostor who knows not the secrets of the Void." +
            " Behold the Tenno, come to scavenge and desecrate this sacred realm. My brothers, did I not tell of this day? Did I not prophesize this moment?" +
            " Now, I will stop them. Now I am changed, reborn through the energy of the Janus Key. Forever bound to the Void." +
            " Let it be known, if the Tenno want true salvation, they will lay down their arms, and wait for the baptism of my Janus key. It is time." +
            " I will teach these trespassers the redemptive power of my Janus key. They will learn it's simple truth. The Tenno are lost, and they will resist." +
            " But I, Vor, will cleanse this place of their impurity.");

        this.registerIncludes("to pay respects", "F");
        this.registerIncludes("^([iI]'?m ).*", Memes.dadJoke);
        this.registerIncludes("captain vor", "Look at them, they come to this place when they know they are not pure. Tenno use the keys, but they are mere trespassers." +
            " Only I, Vor, know the true power of the Void. I was cut in half, destroyed, but through it's Janus Key, the Void called to me." +
            " It brought me here and here I was reborn. We cannot blame these creatures, they are being led by a false prophet, an impostor who knows not the secrets of the Void." +
            " Behold the Tenno, come to scavenge and desecrate this sacred realm. My brothers, did I not tell of this day? Did I not prophesize this moment?" +
            " Now, I will stop them. Now I am changed, reborn through the energy of the Janus Key. Forever bound to the Void." +
            " Let it be known, if the Tenno want true salvation, they will lay down their arms, and wait for the baptism of my Janus key. It is time." +
            " I will teach these trespassers the redemptive power of my Janus key. They will learn it's simple truth. The Tenno are lost, and they will resist." +
            " But I, Vor, will cleanse this place of their impurity.");
        this.registerIncludes("did you really believe it would be this easy", "https://youtu.be/wOygJJ7Zudk?t=20s")
        this.registerIncludes("unhook", "JAR OF LIPS\nJAR OF LIPS\nJAR OF LIPS");
        this.registerIncludes("sonya", "ello cute boy! My name is Sonya I'm a very beautiful" +
            " girl, most recently I was left alone. Five months ago a guy threw me, and I did" +
            " not have a man all this time. I'm young and young girl I need constant sex. Friends" +
            " and girlfriends I have very little, and friends they can not be called. From my" +
            " environment, I do not want anyone to have any sexual relations. Therefore I am" +
            " writing this letter to you. I want to find a lover, I hope that it will be you. I" +
            " saw your photos, and I really liked you. I hope you find some time for me? My strength" +
            " is not how I want sex, I even bought myself a rubber penis. But this is not the same," +
            " I want a real, big, hot male dick! I am writing you a letter and are excited! My" +
            " panties are already very wet, I get up from the table and lie down on the bed and start" +
            " playing with my fingers between my legs. Under the pillow is my rubber friend, I take it" +
            " in my hands and touch them to my swollen the nipples go down lower and lower ... I remove" +
            " through the damp strip of panties, and begin to massage the swollen excitation of the" +
            " clitoris. My juices flow already onto the sheet, I can not stand anymore, I'm excited to" +
            " the limit. I spread my legs wider, and slowly introduce penis in your pussy. I began to" +
            " hurt for a second, but the sweet sensations and fantasies in This head was immediately" +
            " drowned out of my head. I want you. I represent you in my fantasies, I imagine that" +
            " you're fucking me like a bitch, groaning with pleasure and moving faster. Oh yeah, my body" +
            " is pierced by millions sweet needles and starting to wriggle under you and you do not let" +
            " go and continue hard fuck me. I blew the whole sheet)) That's how hard it is to live" +
            " without sex. I really hope that you will answer me and we will soon meet in my house. I" +
            " made you a photo, I'll send it in a letter. Even more of my photos You can look in the photo" +
            " album on the web site, I'm there permanently in the network and here I am very rare. My" +
            " id6767889. I'll be waiting for you. Kissing you tenderly. Your Sonya.");
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
        key = key.toLowerCase();
        if (typeof output === "function") {
            this.includes[key] = output;
        } else {
            this.includes[key] = Memes.switchedSend.bind(this, output);
        }
    }


    /**
     * Register an output to be sent if the message equals the key.
     * If the output is a function, that is called. Otherwise it is send to the channel.
     *
     * The key and the message will both be converted to lower case.
     *
     * @param key The key to register with
     * @param output The output to send.
     */
    registerEquals(key, output) {
        key = key.toLowerCase();
        if (typeof output === "function") {
            this.equals[key] = output;
        } else {
            this.equals[key] = Memes.switchedSend.bind(this, output);
        }
    }

    static switchedSend(output, msg) {
        Memes.sendOutput(msg, output)
    }

    /**
     * Check through all the bound values to see if any match.
     * If a match is found, calls the corresponding function.
     *
     * @param msg The message received
     */
    message(msg) {
        if (!msg.author.bot) {
            for (let key in this.equals) {
                if (msg.content.toLowerCase() === key) {
                    this.equals[key](msg);
                }
            }
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
        Memes.sendOutput(msg, options[choice])
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
            Memes.sendOutput(msg, options[choice]);
        } else {
            let options = ["Straight", "Trisexual"];
            let choice = Math.floor(Math.random() * options.length);
            Memes.sendOutput(msg, options[choice]);
        }
    }

    static dadJoke(msg) {
        const size = msg.toString().toLowerCase().match("^([iI]'?m ).*")[1].length;
        Memes.sendOutput(msg, `Hi ${msg.toString().substr(size)}, I'm Dad!`);
    }
}

module.exports = Memes;

