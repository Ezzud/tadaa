'use strict';
const Discord = require('discord.js');
let emojiMap = {
    link: "732605373185261629",
    dev: "732605373185261608",
    sharding: "732605372954575029",
    computer: "732607541061877760",
    memoire: "732698462822596659",
    okay: "732581317098602546",
    nope: "732581316880498782",
    info: "732581319971831808",
    what: "732581319678361662",
    warn: "732581316217929782"
};
const config = require('../config.json')
const json = require('../package.json')
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const delay = new Set()
const gwDelay = new Set()
const GiveawaysManager = require('../src/Manager');
const GiveawayManagerWithShardSupport = class extends GiveawaysManager {
    async refreshStorage() {
        return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
    }
};
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
module.exports = async (client, message) => {
    const manager = client.giveawaysManager;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
    let pf = await database.get(`data.prefix`).value()
    if (!pf) {
        pf = config.prefix
        await database.set(`data.prefix`, pf).write()
    }
    if (message.content === '<@!732003715426287676>' || message.content === '<@732003715426287676>') {
        var embed = new Discord.MessageEmbed().setAuthor(`TADAA`, client.user.avatarURL).setDescription(`Préfixe: **${pf}**\n\n*Faites ${pf}help pour plus d'infos*`).setColor(`#F67272`).setTimestamp().setFooter(`TADAA v${json.version}`, message.author.avatarURL)
        message.channel.send(embed)
    }
    if (message.content.startsWith(pf)) {
        let args = message.content.slice(pf.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        const nope = getEmoji("nope")
        const info = getEmoji("info")
        const okay = getEmoji("okay")
        const what = getEmoji("what")
        const warning = getEmoji("warn")
        let commands_file = client.commands.get(command);
        if(commands_file && !message.guild.channels.cache.get(message.channel.id).memberPermissions(message.guild.member(client.user)).has(2048)) {
            let noPermembed = new Discord.MessageEmbed().setAuthor(`TADAA`, client.user.avatarURL).setDescription(`${getEmoji("nope")} Je n'ai pas la permission d'écrire dans le salon où la commande a été envoyée`).setColor(`#F67272`).setTimestamp().setFooter(`TADAA v${json.version}`, message.author.avatarURL)      
            return message.author.send(noPermembed);
        }
        if (command === 'edit' || command === 'delete' || command === 'end' || command === 'start') {
            if (gwDelay.has(message.author.id)) {
                let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `Veuillez patienter *10 secondes* avant chaque utilisation de cette commande`).setFooter(`TADAA v${json.version}`)
                message.channel.send(embed)
                return;
            } else {
                gwDelay.add(message.author.id)
                setTimeout(() => {
                    gwDelay.delete(message.author.id)
                }, 10000)
            }
        } else {
            if (delay.has(message.author.id)) {
                let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `Veuillez patienter *3 secondes* avant chaque utilisation de commande`).setFooter(`TADAA v${json.version}`)
                message.channel.send(embed)
                return;
            } else {
                delay.add(message.author.id)
                setTimeout(() => {
                    delay.delete(message.author.id)
                }, 3000)
            }
        }
        let commande_file = client.commands.get(command);
        if (commande_file) commande_file.run(client, pf, message, args, nope, info, okay, what, warning, manager, json, command);
    }
};