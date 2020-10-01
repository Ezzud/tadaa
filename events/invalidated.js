'use strict';
const Discord = require("discord.js");
const settings = require('../config.json');
module.exports = async (client) => {
    client.destroy().then(() => {
        client.login(settings.token)
    })
}