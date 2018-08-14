/**WeaverDice Commands */


exports.registerBot = (bot) => {
    bot.on("message", msg => {
        if (msg.content.toLowerCase() === 'wd>helpme') {
            msg.reply('some shit');
        
        }
    })
}

















        // Your bot.on stuff all goes inbetween these two        