'use strict';
const fs = require('fs');
const Discord = require("discord.js");
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const json = require('../package.json')
module.exports = async (client) => {
    let stv;
    if (client.guilds.size <= 1) {
        stv = 'serveur'
    } else {
        stv = 'serveurs'
    }
    console.log(`\x1b[32m[SHARD]` + ` \x1b[0mSHARD #${client.shard.ids[0]} OPERATIONNEL`)
    await sleep(15000)
    let count = 0;
    let values = await client.shard.broadcastEval(`
    [
        this.shard.id
    ]
`);
    values.forEach((value) => {
        count = count + 1
    });
    let prereq;
    prereq = await client.shard.fetchClientValues('guilds.cache.size');
    prereq = prereq.reduce((p, n) => p + n, 0);
    await client.user.setPresence({
        activity: {
            name: `@TADAA | Shard ${count}/${client.shard.count} | ${prereq} serveurs | v${json.version}`
        },
        status: 'dnd'
    })
    setInterval(async () => {
        let count2 = 0;
        let values2 = await client.shard.broadcastEval(`
    [
        this.shard.id
    ]
    `);
        values2.forEach((value) => {
            count2 = count2 + 1
        });
        let req;
        req = await client.shard.fetchClientValues('guilds.cache.size');
        req = req.reduce((p, n) => p + n, 0);
        await client.user.setPresence({
            activity: {
                name: `@TADAA | ${req} serveurs | v${json.version} | Shard ${count2}/${client.shard.count}`
            },
            status: 'dnd'
        })
    }, 300000);
}