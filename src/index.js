require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const cron = require('node-cron');
const { Sequelize } = require('sequelize');

const channelId = '1068546842247303191';

//Intents are a set of permissions that your bot can use to get access to a set of events
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
})

client.commands = new Collection();

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

const Images = sequelize.define('images', {
    imgname: Sequelize.STRING,
    img: Sequelize.STRING,
});

client.once(Events.ClientReady, () => {
	//Tags.sync();
    Images.sync();
	console.log(`Logged in as ${client.user.tag}!`);
});

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

    if (message.content === '!cat') {
        const channel = client.channels.cache.get(channelId);
        if (channel) {
        channel.send({
            files: [{
            attachment: '/Users/matthewen/Documents/Cat Pics/IMG_0094.PNG',
            name: 'IMG_0094.PNG',
            description: 'Shiro sitting on a chair'
            }]
        }).then(console.log).catch(console.error);
        }
    }

});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
});

cron.schedule('54 21 * * *', () => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      channel.send({
        files: [{
        attachment: '/Users/matthewen/Documents/Cat Pics/IMG_0094.PNG',
        name: 'IMG_0094.PNG',
        description: 'Shiro sitting on a chair'
        }]
      }).then(console.log).catch(console.error);
    }
  });


client.login(process.env.TOKEN);