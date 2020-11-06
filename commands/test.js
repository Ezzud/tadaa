'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const fs = require('fs');
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager) => {
	let guild = client.guilds.cache.get('762057976072110091')
	if(!guild) return(console.log('No Guild'));
    manager.start(message.channel, {
        time: ms("1m"),
        IsRequiredRole: false,
        IsRequiredServer: true,
        requiredServer: guild.id,
        requiredServerName: guild.name,
        requiredRole: null,
        prize: "Test Prize",
        winnerCount: 1
    })
}
module.exports.help = {
    name: "test"
}