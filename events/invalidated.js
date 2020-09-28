   
const Discord = require("discord.js");
const settings = require('../config.json');
module.exports = async (client) => {
client.login(settings.token)
}