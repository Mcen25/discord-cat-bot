const { Client, IntentsBitField} = require('discord.js');

//Intents are a set of permissions that your bot can use to get access to a set of events
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

//c is for client
client.on('ready', (c) => {
    console.log(`🐈 ${c.user.tag} is online.`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
    if (message.content === 'hello') {
        message.reply('Hey! 🐈');
    }
});

client.login('MTE2MjU2NTUxODQ5NTA1NjAxMg.Gq58en.ZbD35BCB12sRBi5adsu-SLvbZFZs75j4o2fVks');