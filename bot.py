from discord.ext import commands
import discord

description = '''A discord bot that posts a picture of cat once a day'''
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

BOT_TOKEN = "MTE2MjU2NTUxODQ5NTA1NjAxMg.GpqnAt.9ZSF2sp_MuMF4YkFA44Mm_VwigrOy3kwlPwTqw"
CHANNEL_ID = 1162833235219320952

bot = commands.Bot(command_prefix='?', description=description, intents=intents)

@bot.event
async def on_ready():
    print("Hello! Study bot is ready!")
    channel = bot.get_channel(CHANNEL_ID)
    await channel.send("Hello! Study bot is ready!")

bot.run(BOT_TOKEN)