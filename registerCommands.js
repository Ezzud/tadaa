const { Client, Intents } = require("discord.js");
const Discord = require("discord.js")
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS],
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER'],
    disableMentions: "everyone"
});
const ms = require('ms');
const settings = require('./config.json');
const fs = require('fs');
const moment = require('moment');
const json = require('./package.json')
moment.locale("fr")



async function main() {
        const {
            SlashCommandBuilder
        } = require('@discordjs/builders');
        let commandsArray = []


        let data1 = new SlashCommandBuilder()
        .setName("dmwin")
        .setDescription("Enable/Disable sending dm to winners")
        .addBooleanOption(option => option.setName("value")
            .setDescription("Enable/Disable")
            .setRequired(true))
    commandsArray.push(data1.toJSON())

        let data2 = new SlashCommandBuilder()
            .setName("start")
            .setDescription("Start a giveaway")
            .addChannelOption(option => option.setName("channel")
                .setDescription("Choose the channel")
                .setRequired(true))
            .addStringOption(option => option.setName("duration")
                .setDescription("Choose the duration: 5m (5 minutes), 1h (1 hour), 6d (6 days)")
                .setRequired(true))
            .addIntegerOption(option => option.setName("winners")
                .setDescription("Choose the number of winners")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(25))
            .addStringOption(option => option.setName("prize")
                .setDescription("Choose the giveaway\'s prize")
                .setRequired(true))
            .addRoleOption(option => option.setName("required_role")
                .setDescription("Users must have a specific role to participate")
                .setRequired(false)) 
            .addStringOption(option => option.setName("required_server")
                .setDescription("Users must be in a specific server to participate")
                .setRequired(false))
        commandsArray.push(data2.toJSON())

        let data3 = new SlashCommandBuilder()
            .setName("config")
            .setDescription("Display the server's configuration")
        commandsArray.push(data3.toJSON())

        let data4 = new SlashCommandBuilder()
            .setName("end")
            .setDescription("End a giveaway")
        commandsArray.push(data4.toJSON())

        let data5 = new SlashCommandBuilder()
            .setName("delete")
            .setDescription("Delete a giveaway")
        commandsArray.push(data5.toJSON())

        let data6 = new SlashCommandBuilder()
        .setName("reroll")
        .setDescription("Reroll a giveaway")
        commandsArray.push(data6.toJSON())

        let data7 = new SlashCommandBuilder()
        .setName("list")
        .setDescription("List all active giveaways")
        commandsArray.push(data7.toJSON())

        let data8 = new SlashCommandBuilder()
            .setName("help")
            .setDescription("Display the help menu")
        commandsArray.push(data8.toJSON())

        let data9 = new SlashCommandBuilder()
            .setName("info")
            .setDescription("Display informations about the bot")
        commandsArray.push(data9.toJSON())

        let data10 = new SlashCommandBuilder()
            .setName("ping")
            .setDescription("Get the bot's ping")
        commandsArray.push(data10.toJSON())

        let data11 = new SlashCommandBuilder()
            .setName("stats")
            .setDescription("Get the bot's statistics")
        commandsArray.push(data11.toJSON())

        let data12 = new SlashCommandBuilder()
            .setName("rainbow")
            .setDescription("Enable/Disable rainbow mode")
            .addBooleanOption(option => option.setName("value")
                .setDescription("Enable/Disable")
                .setRequired(true))
        commandsArray.push(data12.toJSON())

        let data13 = new SlashCommandBuilder()
            .setName("edit")
            .setDescription("Edit a giveaway")
            .addStringOption(option => option.setName("value")
                .setDescription("Choose the value to change")
                .setRequired(true)
                .addChoice('Winners count', 'winners')
                .addChoice('Prize', 'prize'))
            .addStringOption(option => option.setName('new_value')
                .setDescription(`New value`)
                .setRequired(true));
        commandsArray.push(data13.toJSON())

        let data14 = new SlashCommandBuilder()
            .setName("vote")
            .setDescription("See the different vote links");
        commandsArray.push(data14.toJSON())






        let data16 = new SlashCommandBuilder()
            .setName("setlang")
            .setDescription("Change bot's language")
            .addStringOption(option => option.setName("lang")
                .setDescription("Choose the language")
                .setRequired(true)
                .addChoice('Français (fr_FR)', 'fr_FR')
                .addChoice('English (en_US)', 'en_US'))
        commandsArray.push(data16.toJSON())

        let data17 = new SlashCommandBuilder()
            .setName("languages")
            .setDescription("See available languages")
        commandsArray.push(data17.toJSON())







        let data19 = new SlashCommandBuilder()
            .setName("support")
            .setDescription("Display support server invite")
        commandsArray.push(data19.toJSON())

        let data20 = new SlashCommandBuilder()
            .setName("invite")
            .setDescription("Display bot's invite link")
        commandsArray.push(data20.toJSON())






        console.log(commandsArray)
        const { REST } = require('@discordjs/rest');
        const { Routes } = require('discord-api-types/v9');
        const rest = new REST({ version: '9' }).setToken(settings.token);
        /*
        rest.get(Routes.applicationCommands(settings.applicationID))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(settings.applicationID)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
    });
    */
    
        (async() => {
            try {
                console.log(' Started refreshing application (/) commands.');
                await rest.put(Routes.applicationCommands(settings.applicationID), {
                    body: commandsArray
                }, );
                console.log(' Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
        console.log(` \x1b[32m` + ` \x1b[32mChargement des commandes effectué` + `\x1b[0m`);
        
}

main().then(async() => console.log(`Register starting`)).catch(async(err) => {
    console.log(`Error while registering commands!`)
    console.log(err)
})