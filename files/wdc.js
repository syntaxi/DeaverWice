/**WeaverDice Commands */


exports.registerBot = (bot) => {
    bot.on("message", msg => {
        if (msg.content.toLowerCase() === 'wd>helpme') {
            msg.reply('some shit');
        } else if (msg.content.toLowerCase() === 'wd>cut lesser' || msg.content.toLowerCase() === 'wd>cut less' || msg.content.toLowerCase() === 'wd>cut l'){
            msg.reply('yo mum gay');
        }
    })
}

















        // Your bot.on stuff all goes inbetween these two        