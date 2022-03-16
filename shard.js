const Discord = require('discord.js');
const config = require('./config.json')
const Manager = new Discord.ShardingManager('./index.js', {
    totalShards: 2,
    token: config.token,
    respawn: true
});

Manager.spawn();