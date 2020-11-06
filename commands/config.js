'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
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
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager,json) => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} Vous n'avez pas la permission`).setFooter(`TADAA | v${json.version}`)
    if (!message.guild.member(message.author).hasPermission(8)) return (message.channel.send(embed));
    if (!args[0]) {
        let dmWin = await database.get(`data.isDMWin`).value()
        if (!dmWin) {
            dmWin = true
            await database.set(`data.isDMWin`, true).write()
        }
        let dmWinm;
        if (dmWin === true) {
            dmWinm = `Activé!`
        } else if (dwWin === false) {
            dmWinm = `Désactivé!`
        } else {
            dmWinm = `Inconnu!`
        }
        let embed = new Discord.MessageEmbed().setAuthor(`Configuration`, message.guild.iconURL()).setThumbnail(client.user.avatarURL()).setDescription(`Serveur: ${message.guild.name}`).setColor(`#5ED5F5`).addField(`${info} Valeurs`, `Préfixe: **${pf}**\nEnvoi de message privé si un giveaway est gagné: **${dmWinm}**\n\u200B`).addField(`${what} Changer une valeur?`, `${pf}config prefix \`<Nouveau préfixe>\`\n${pf}config dmWin \`<Oui/Non>\``).setFooter(`TADAA | v${json.version}`, message.author.avatarURL()).setTimestamp()
        message.channel.send(embed)
    }
    if (!args[0]) return;
    if (args[0] === 'prefix') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} Veuillez renseigner un préfixe`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
            return;
        }
        if (args[1] === await database.get(`data.prefix`).value()) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} Le nouveau préfixe est le même que l'ancien`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
            return;
        }
        if(args[1].length > 3) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} Le préfixe ne peut pas faire plus de 3 caractères maximum`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
            return;
        }
        await database.set(`data.prefix`, args[1]).write()
        let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} Le préfixe du bot est désormais \`${await database.get(`data.prefix`).value()}\``).setFooter(`TADAA | v${json.version}`)
        message.channel.send(embed)
    } else if (args[0].toLowerCase() === 'dmwin') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner une valeur* \`(Oui/Non)\` `).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
            return;
        }
        if (args[1].toLowerCase() === 'oui') {
            if (await database.get(`data.isDMWin`).value() === true) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Les messages privés sont déjà activés*`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
                message.channel.send(embed)
                return;
            }
            await database.set(`data.isDMWin`, true).write()
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} *L'envoi de message privé aux gagnants est désormais \`activé\`*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
        } else if (args[1].toLowerCase() === 'non') {
            if (await database.get(`data.isDMWin`).value() === false) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Les messages privés sont déjà désactivés*`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
                message.channel.send(embed)
                return;
            }
            await database.set(`data.isDMWin`, false).write()
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} *L'envoi de message privé aux gagnants est désormais \`désactivé\`*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`Syntaxe`, `${pf}config prefix \`<Nouveau préfixe>\``).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
        }
    }
}
module.exports.help = {
    name: "config"
}