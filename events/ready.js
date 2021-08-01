'use strict';
const fs = require('fs');
const Discord = require("discord.js");
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
const json = require('../package.json')
module.exports = async (client) => {
    let delay = new Date() - client.time;
    delay = delay / 1000
    console.log(`\x1b[34m[API]` + ` \x1b[0mShard #${client.shard.ids[0]} fonctionnel (${delay}s)`)
    await sleep(15000)
    let count = 0;
    let values = await client.shard.broadcastEval(`[this.shard.id]`);
    values.forEach((value) => {
        count = count + 1
    });
    let prereq;
    prereq = await client.shard.fetchClientValues('guilds.cache.size');
    prereq = prereq.reduce((p, n) => p + n, 0);
    let onServer = client.giveawaysManager.giveaways.filter((g) => g.ended !== true);
    onServer = onServer.length
    await client.user.setPresence({
        activity: {
            name: `${config.prefix}help or @${client.user.username} • ${prereq} guilds • ${onServer} active giveaways`
        },
        status: 'online'
    })
    if (config.topggEnabled === true) {
        let api = new Topgg.Api(config.topggToken)
        await api.postStats({
            serverCount: prereq,
            shardCount: client.shard.count
        }).catch(err => {
            console.log(err)
        })
    }
    setInterval(async () => {
        let count2 = 0;
        let values2 = await client.shard.broadcastEval(`[this.shard.id]`);
        values2.forEach((value) => {
            count2 = count2 + 1
        });
        let req;
        req = await client.shard.fetchClientValues('guilds.cache.size');
        req = req.reduce((p, n) => p + n, 0);
        let onServer = client.giveawaysManager.giveaways.filter((g) => g.ended !== true);
        onServer = onServer.length
        await client.user.setPresence({
            activity: {
                name: `${config.prefix}help or @${client.user.username} • ${prereq} guilds • ${onServer} active giveaways`
            },
            status: 'online'
        })
        if (config.topggEnabled === true) {
            let api = new Topgg.Api(config.topggToken)
            await api.postStats({
                serverCount: req,
                shardCount: client.shard.count
            }).catch(err => {
                console.log(err)
            })
        }
    }, 300000);
}