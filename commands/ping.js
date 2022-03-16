'use strict';
const Discord = require("discord.js");
const moment = require('moment');

module.exports.run = async (client, pf, message, manager, json, lang) => {
    var messagePing = new Date().getTime() - message.createdTimestamp
    var apiPing = Math.trunc(client.ws.ping)
    await message.deferReply()
    
    let color;
    if (apiPing + messagePing > 500) {
        color = client.dnd
    } else if (apiPing + messagePing > 250) {
        color = client.afk
    } else {
        color = client.online
    }
    message.editReply(lang.pingEnd.split("%messagePing%").join(messagePing).split("%apiPing%").join(apiPing).split("%color%").join(color))
}
module.exports.help = {
    name: "ping"
}