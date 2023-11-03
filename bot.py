# This example requires the 'message_content' intent.

import discord

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'We have logged in as {client.user}')

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('$hello'):
        await message.channel.send('Hello!')

client.run('MTE2OTQ5NzcwNTc5MDMxNjU1NA.G0IadR.wLR5pXqy6PORbB-Ww1qZE00Ht0Wnl1dstKQul8')
