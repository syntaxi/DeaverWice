/**Memes and like, whatever */
exports.registerBot = (bot) => {
    bot.on("message", msg => {
        if (msg.content.toLowerCase() === 'friskyfoxx') {
            msg.reply('Don\'t you mean\.\.\. Mother?');
        } else if (msg.content.toLowerCase().includes('unhook')) {
            msg.reply('JAR OF LIPS');
            msg.reply('JAR OF LIPS');
            msg.reply('JAR OF LIPS');
            msg.reply('TEST IGNORE');
        } else if (msg.content.toLowerCase().includes('nice')) {
            msg.reply('Join');
        } else if (msg.content.toLowerCase() === 'wd>help') {
            msg.reply('No.');
        } else if (msg.content.toLowerCase() === 'wd>gender') {
            let options = ["Male", "Female", "Trap"];
            let choice = Math.floor(Math.random() * options.length);
            msg.reply(options[choice])
        } else if (msg.content.toLowerCase() === 'wd>sex') {
                if (Math.random() < 0.4) {
                    let options = ["Straight", "Gay", "Bi", "A", "*Clang! Clang!* you are Pansexual!", "Demi", "Poly", "Furry", "THE BIG GAY"];
                    let choice = Math.floor(Math.random() * options.length);
                    msg.reply(options[choice]);
                } else {
                    let options = ["Straight", "Trisexual"];
                    let choice = Math.floor(Math.random() * options.length);
                    msg.reply(options[choice]);
                }                
            } else if (msg.content.toLowerCase().includes('wd>sonya')) {
                msg.reply("ello cute boy! My name is Sonya I'm a very beautiful girl, most recently I was left alone. Five months ago a guy threw me, and I did not have a man all this time. I'm young and young girl I need constant sex. Friends and girlfriends I have very little, and friends they can not be called. From my environment, I do not want anyone to have any sexual relations. Therefore I am writing this letter to you. I want to find a lover, I hope that it will be you. I saw your photos, and I really liked you. I hope you find some time for me? My strength is not how I want sex, I even bought myself a rubber penis. But this is not the same, I want a real, big, hot male dick! I am writing you a letter and are excited! My panties are already very wet, I get up from the table and lie down on the bed and start playing with my fingers between my legs. Under the pillow is my rubber friend, I take it in my hands and touch them to my swollen the nipples go down lower and lower ... I remove through the damp strip of panties, and begin to massage the swollen excitation of the clitoris. My juices flow already onto the sheet, I can not stand anymore, I'm excited to the limit. I spread my legs wider, and slowly introduce penis in your pussy. I began to hurt for a second, but the sweet sensations and fantasies in This head was immediately drowned out of my head. I want you...");
                msg.reply("'I represent you in my fantasies, I imagine that you're fucking me like a bitch, groaning with pleasure and moving faster. Oh yeah, my body is pierced by millions sweet needles and starting to wriggle under you and you do not let go and continue hard fuck me. I blew the whole sheet)) That's how hard it is to live without sex. I really hope that you will answer me and we will soon meet in my house. I made you a photo, I'll send it in a letter. Even more of my photos You can look in the photo album on the web site, I'm there permanently in the network and here I am very rare. My id6767889. I'll be waiting for you. Kissing you tenderly. Your Sonya.");


        } else if (msg.content === 'what is my avatar') {
            msg.reply(message.author.avatarURL);
        }
    });
};

