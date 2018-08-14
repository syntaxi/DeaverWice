/**Memes and like, whatever */
exports.registerBot = (bot) => {
    bot.on("message", msg => {
        if (msg.content.toLowerCase() === 'friskyfoxx') {
            msg.reply('Don\'t you mean\.\.\. Mother?');
        } else if (msg.content.toLowerCase().includes('unhook')) {
            msg.reply('JAR OF LIPS');
            msg.reply('JAR OF LIPS');
            msg.reply('JAR OF LIPS');
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
        } else if (msg.content === 'what is my avatar') {
            msg.reply(message.author.avatarURL);
        }
    });
};

