#import mysql.connector
import discord
from discord.ext import commands

intents = discord.Intents.default()
intents.members = True
prefix = "!"
bot = commands.Bot(command_prefix=prefix, help_command=None, intents=intents)
token = "MTE2MjU2NTUxODQ5NTA1NjAxMg.GgXqgM.IZ2nFQWS5_1HsSfQVHv1PDsRue3jxX2_G0sf98"

@bot.event
async def on_ready():
    print("Online")

bot.run(token)