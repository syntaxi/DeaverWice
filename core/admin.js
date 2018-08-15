class commands {
    message(message) {
        // Ignore messages that aren't from a guild
        if (!message.guild) {
            return;
        }

        // If the message content starts with "!kick"
        if (message.content.startsWith('wd>kick')) {
            // Assuming we mention someone in the message, this will return the user
            // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
            const user = message.mentions.users.first();
            // If we have a user mentioned
            if (user) {
                // Now we get the member from the user
                const member = message.guild.member(user);
                // If the member is in the guild
                if (member) {
                    /**
                     * Kick the member
                     * Make sure you run this on a member, not a user!
                     * There are big differences between a user and a member
                     */
                    member.kick('Optional reason that will display in the audit logs').then(() => {
                        // We let the message author know we were able to kick the person
                        message.reply(`That boi got booted! YW bbygurl ${user.tag}`);
                    }).catch(err => {
                        // An error happened
                        // This is generally due to the bot not being able to kick the member,
                        // either due to missing permissions or role hierarchy
                        message.reply('I was unable to kick the member');
                        // Log the error
                        console.error(err);
                    })
                    ;
                } else {
                    // The mentioned user isn't in this guild
                    message.reply('That user isn\'t in this guild!');
                }
                // Otherwise, if no user was mentioned
            } else {
                message.reply('Please @ the person you with to kick!');
            }
        }
        if (!message.guild)
            return;

        // if the message content starts with "!ban"
        if (message.content.startsWith('wd>ban')) {
            // Assuming we mention someone in the message, this will return the user
            // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
            const
                user = message.mentions.users.first();

            // If we have a user mentioned
            if (user) {
                // Now we get the member from the user
                const member = message.guild.member(user);
                // If the member is in the guild
                if (member) {
                    /**
                     * Ban the member
                     * Make sure you run this on a member, not a user!
                     * There are big differences between a user and a member
                     * Read more about what ban options there are over at
                     * https://discord.js.org/#/docs/main/stable/class/GuildMember?scrollTo=ban
                     */
                    member.ban({reason: 'Disgusting.',}).then(() => {
                        // We let the message author know we were able to ban the person
                        message.reply(`That bitch empty, Yeet! ${user.tag}`);
                    }).catch(err => {
                        // An error happened
                        // This is generally due to the bot not being able to ban the member,
                        // either due to missing permissions or role hierarchy
                        message.reply('Try again');
                        // Log the error
                        console.error(err);
                    });
                } else {
                    // The mentioned user isn't in this guild
                    message.reply('That user isn\'t in this guild!');
                }
            }

            else {
                // Otherwise, if no user was mentioned
                message.reply('Please @ the person you wish to ban');
            }
        }
    }
}

module.exports = commands;