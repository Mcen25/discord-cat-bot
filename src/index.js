require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { Client: PGClient} = require('pg');
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

const pgClient = new PGClient({
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

client.commands = new Collection();

client.once(Events.ClientReady, () => {
    pgClient.connect()
        .then(() => console.log('Connected to PostgreSQL'))
        .catch(err => console.error('Connection error', err.stack));

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

    if (message.content === 'ping') {
        pgClient.query('SELECT imgname FROM images', (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
            } else {
                // Convert each row to a string and join them with a newline
                // const resultString = res.rows.map(row => JSON.stringify(row)).join('\n');

                // Send the result as a message
                const imgname = res.rows[0].imgname;
                message.reply(imgname);
            }})
    }

    if (message.content === 'catdb') {
        pgClient.query("SELECT imgurl FROM images WHERE imgname = 'test2'", (err, res) => {
            if (err) {
                console.error('Error executing query', err.stack);
            } else {

                const imgURL = res.rows[0].imgurl;
                // message.reply(imgURL);
                image(message, 293, 633, imgURL);
            }});
    }

    if (message.content === 'hello') {
        message.reply('Hey! 🐈');
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