require('dotenv').config();
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder} = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const channelId = '1068546842247303191';

// Gaming poll configuration
const GAMING_POLL_CHANNEL_ID = '1068546842247303191'; // Change this to your desired channel ID
const POLL_TIME_HOUR = 12; // 12:00 PM (24-hour format)
const POLL_TIME_MINUTE = 0; // 0 minutes
const POLL_DURATION_HOURS = 8;

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

client.once(Events.ClientReady, () => {
	console.log(`Logged in as ${client.user.tag}!`);
    
    // Start the daily poll scheduler
    scheduleDailyGamingPoll();
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
        message.reply('Pong! 🏓');
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

    if (message.content === '!testpoll') {
        if (message.member.permissions.has('ADMINISTRATOR')) {
            createGamingPoll();
            message.reply('🎮 Test gaming poll created!');
        } else {
            message.reply('❌ You need administrator permissions to test the poll.');
        }
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

// Function to create the daily gaming poll
async function createGamingPoll() {
    try {
        const channel = client.channels.cache.get(GAMING_POLL_CHANNEL_ID);
        if (!channel) {
            console.error('Gaming poll channel not found!');
            return;
        }

        const now = new Date();
        const pollEndTime = new Date(now.getTime() + (POLL_DURATION_HOURS * 60 * 60 * 1000));
        
        const pollEmbed = new EmbedBuilder()
            .setTitle('🎮 Gaming Time Poll!')
            .setDescription('Do the boys want to game today?')
            .addFields(
                { name: '🕐 Poll Duration', value: `${POLL_DURATION_HOURS} hours`, inline: true },
                { name: '⏰ Ends at', value: `<t:${Math.floor(pollEndTime.getTime() / 1000)}:t>`, inline: true }
            )
            .setColor(0x00AE86)
            .setFooter({ text: 'React with your choice!' })
            .setTimestamp();

        const pollMessage = await channel.send({ 
            content: '🎮 **Daily Gaming Poll** 🎮\n@everyone',
            embeds: [pollEmbed] 
        });

        // Add reaction options
        await pollMessage.react('✅'); // Yes
        await pollMessage.react('❌'); // No
        await pollMessage.react('🤔'); // Maybe
        await pollMessage.react('🕐'); // Later

        console.log(`📊 Daily gaming poll created at ${now.toLocaleTimeString()}`);

        // Schedule poll results after 8 hours
        setTimeout(async () => {
            try {
                const updatedMessage = await pollMessage.fetch();
                const reactions = updatedMessage.reactions.cache;
                
                const results = {
                    yes: reactions.get('✅')?.count - 1 || 0,
                    no: reactions.get('❌')?.count - 1 || 0,
                    maybe: reactions.get('🤔')?.count - 1 || 0,
                    later: reactions.get('🕐')?.count - 1 || 0
                };

                const resultsEmbed = new EmbedBuilder()
                    .setTitle('🎮 Gaming Poll Results!')
                    .setDescription('Here are the final results:')
                    .addFields(
                        { name: '✅ Yes', value: `${results.yes} votes`, inline: true },
                        { name: '❌ No', value: `${results.no} votes`, inline: true },
                        { name: '🤔 Maybe', value: `${results.maybe} votes`, inline: true },
                        { name: '🕐 Later', value: `${results.later} votes`, inline: true }
                    )
                    .setColor(0xFF6B6B)
                    .setFooter({ text: 'Poll has ended!' })
                    .setTimestamp();

                await channel.send({ embeds: [resultsEmbed] });
                console.log('📊 Gaming poll results posted');
            } catch (error) {
                console.error('Error posting poll results:', error);
            }
        }, POLL_DURATION_HOURS * 60 * 60 * 1000);

    } catch (error) {
        console.error('Error creating gaming poll:', error);
    }
}

// Function to schedule daily polls
function scheduleDailyGamingPoll() {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(POLL_TIME_HOUR, POLL_TIME_MINUTE, 0, 0);

    // If we've already passed today's scheduled time, schedule for tomorrow
    if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilFirstPoll = scheduledTime - now;
    
    console.log(`🕐 Next gaming poll scheduled for: ${scheduledTime.toLocaleString()}`);

    // Schedule the first poll
    setTimeout(() => {
        createGamingPoll();
        
        // Then schedule daily recurring polls
        setInterval(createGamingPoll, 24 * 60 * 60 * 1000); // Every 24 hours
    }, timeUntilFirstPoll);
}


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
});

client.login(process.env.TOKEN);