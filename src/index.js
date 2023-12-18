require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const { Sequelize } = require('sequelize');
const Canvas = require('@napi-rs/canvas');

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
    dialect: 'postgres',
    logging: false
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

client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content === 'hello') {
        message.reply('Hey! 🐈');
    }

    if (message.content === 'Matt') {
        message.reply('Matt is cool! 🐈');
    }

    if (message.content === '!cat') {
        const file = new AttachmentBuilder('https://upload.wikimedia.org/wikipedia/commons/e/e0/Cat_demonstrating_static_cling_with_styrofoam_peanuts.jpg');

        const electroStatics = {
            title: 'Kitty with styrofoam peanuts',
            image: {
                url: 'attachment://Cat_demonstrating_static_cling_with_styrofoam_peanuts.jpg',
            },
        };
        
        message.channel.send({embeds: [electroStatics], files: [file] });
        console.log(message.channel.id);
        console.log('Sent a cat pic!');
    }

    if (message.content === '!cat2') {
        image(message, 293, 633, '/Users/matthewen/Documents/Cat Pics/ShiroChair.png')
    }

    if (message.content === '!cat3') {
        image(message, 750, 866, '/Users/matthewen/Documents/Cat Pics/IMG_2175.png');
    }

    if (message.content === 'thicc') {
        image(message, 378, 375, '/Users/matthewen/Documents/Cat Pics/IMG_0723.jpg');
    }

    if (message.content === 'loaf') {
        image(message, 216, 288, '/Users/matthewen/Documents/Cat Pics/IMG_3627.jpg');
    }

});

async function image(message, widthInput, heightInput, url) {
    const canvas = Canvas.createCanvas(widthInput, heightInput);

        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(url);
    
        // This uses the canvas dimensions to stretch the image onto the entire canvas
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
    
        // Use the helpful Attachment class structure to process the file for you
        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
    
        message.channel.send({ files: [attachment] });
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
});

client.login(process.env.TOKEN);