'use strict';
const Discord = require("discord.js");
const settings = require('../config.json');
module.exports = async (client) => {
    await client.destroy()
    await client.login(settings.token)
}