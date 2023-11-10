require('dotenv').config();
const { Client, Events, GatewayIntentBits} = require('discord.js');
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

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres'
});

// const Tags = sequelize.define('tags', {
// 	name: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	},
// 	description: Sequelize.TEXT,
// 	username: Sequelize.STRING,
// 	usage_count: {
// 		type: Sequelize.INTEGER,
// 		defaultValue: 0,
// 		allowNull: false,
// 	},
// });

const Images = sequelize.define('images', {
    imgname: Sequelize.TEXT,
    img: Sequelize.BLOB('long'),
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
            attachment: '/Users/matthewen/Documents/IMG_0094.PNG',
            name: 'IMG_0094.PNG',
            description: 'Shiro sitting on a chair'
            }]
        }).then(console.log).catch(console.error);
        }
    }

});

cron.schedule('54 21 * * *', () => {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      channel.send({
        files: [{
        attachment: '/Users/matthewen/Documents/IMG_0094.PNG',
        name: 'IMG_0094.PNG',
        description: 'Shiro sitting on a chair'
        }]
      }).then(console.log).catch(console.error);
    }
  });


client.login(process.env.TOKEN);