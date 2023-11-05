import dotenv from 'dotenv'
dotenv.config()

import { Client, Client, GatewayIntentBits } from 'discord.js'

const Client = new Client( {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
});

Client.login(process.env.DISCORD_TOKEN);