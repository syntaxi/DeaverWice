/* WeaverDice Commands */
class commands {
    message(msg) {
        if (msg.content.toLowerCase() === 'wd>helpme') {
            msg.channel.send("Nice try")
        }
    }
}

module.exports = commands;