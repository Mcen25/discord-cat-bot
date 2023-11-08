require('dotenv').config();
const { Client, IntentsBitField} = require('discord.js');
const cron = require('node-cron');

const channelId = '876661251843952682';

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

cron.schedule('54 21 * * *', () => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      // Send a local file
      channel.send({
        files: [{
        attachment: '/Users/matthewen/Downloads/IMG_0094.PNG',
        name: 'IMG_0094.PNG',
        description: 'Shiro sitting on a chair'
        }]
      }).then(console.log).catch(console.error);
    }
  });


client.login(process.env.TOKEN);