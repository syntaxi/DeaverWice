/* WeaverDice Commands */
class commands {
    constructor(bot){
        this.bot = bot;
    }

    message(msg) {
        if (msg.content.toLowerCase() === 'wd>helpme') {
            msg.channel.send("Nice try")
        }
    }
}

module.exports = commands;