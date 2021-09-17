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
    client.pinglist = [70, 70, 70, 70, 70]

    // GITHUB CHECK
    if(config.checkForUpdate === true) {
    console.log(`\x1b[33m[INFO]` + ` \x1b[37mChecking latest version from Github...` + `\x1b[0m`);
    var octokit = require('@octokit/request')
    var atob = require("atob")
    let version = await octokit.request('GET /repos/Ezzud/tadaa/contents/package.json')
    version = atob(version.data.content)
    version = JSON.parse(version).version
    if (version === json.version) {
        console.log(`\x1b[32m[INFO]` + ` \x1b[37mYou're using the latest version of TADAA! (${version})` + `\x1b[0m`);
    } else {
        console.log(`\x1b[31m[INFO]` + ` \x1b[37mYou're not using the latest version of TADAA (${version}), download the latest version to get fixes & bugs updates at ` + `\x1b[4mhttps://github.com/Ezzud/tadaa\x1b[0m` + ` \x1b[37m(Your version: ${json.version})` + `\x1b[0m`);

    }        
    }



    // AWAIT FOR SHARD READY
    await sleep(5000);


    // DISCORD CHECKS
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
    if (config.topggEnabled === true) {
        client.votes = []
        let api = new Topgg.Api(config.topggToken)
        await api.postStats({
            serverCount: prereq,
            shardCount: client.shard.count
        }).catch(err => {
            if(err);
        })
        client.votes = await api.getVotes().catch(err => {
            if (err);
        })
    }
    await client.user.setPresence({
        activity: {
            name: `${config.prefix}help or @${client.user.username} • ${prereq} guilds • ${onServer} active giveaways`
        },
        status: 'online'
    })
    // Boucle
    setInterval(async () => {
        if (config.topggEnabled === true) {
            let api = new Topgg.Api(config.topggToken)
            client.votes = await api.getVotes().catch(err => {
                if (err) return;
            })
        }
        var list = client.pinglist
        var list2 = list.shift()
        var ping = Math.trunc(client.ws.ping)
        list.push(ping)
        client.pinglist = list
    }, 15000);
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
        if (config.topggEnabled === true) {
            let api = new Topgg.Api(config.topggToken)
            await api.postStats({
                serverCount: req,
                shardCount: client.shard.count
            }).catch(err => {
                if(err);
            })
            client.votes = await api.getVotes().catch(err => {
                if(err);
            })
        }
        await client.user.setPresence({
            activity: {
                name: `${config.prefix}help or @${client.user.username} • ${req} guilds • ${onServer} active giveaways`
            },
            status: 'online'
        })
    }, 300000);
}