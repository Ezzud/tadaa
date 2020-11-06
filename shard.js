const Discord = require('discord.js');
const config = require('./config.json')
const Manager = new Discord.ShardingManager('./index.js', {
    token: config.token,
    autoSpawn: true
});
Manager.spawn(1);
Manager.on('launch', shard => console.log(`\x1b[33m%s\x1b[0m`, '[SHARD]', '\x1b[0m', `PRE-CHARGEMENT - SHARD #${shard.id}`));
Manager.on('disconnecting', shard => {
    console.log(`\x1b[31m%s\x1b[0m`, '[SHARD]', '\x1b[0m', `Reconnexion du shard #${shard.id}`)
    shard.spawn().then(sh => {
        console.log(`\x1b[32m%s\x1b[0m`, '[SHARD]', '\x1b[0m', `Reconnexion réussie du shard #${shard.id}`)
    })
})