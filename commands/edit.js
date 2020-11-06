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
    if (message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
        if (role !== undefined && role !== false && role !== null) {
            console.log('Perms bypakdkdkkfkfdss')
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Vous n'avez pas la permission ni le rôle \`Giveaways\`*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(embed)
            return;
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`).setFooter(`TADAA | v${json.version}`)
    if (!message.guild.member(client.user).hasPermission(19456)) return (message.channel.send(permembed));
    if (!args[0]) {
        let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner l'identifiant du message*`).setFooter(`TADAA | v${json.version}`)
        message.channel.send(embed)
        return;
    }
    if (!args[1]) {
        let nembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner l'option à changer* (gagnants, prix)`).setFooter(`TADAA | v${json.version}`)
        message.channel.send(nembed)
        return;
    }
    if (args[1] === 'gagnants') {
        if (!args[2]) {
            let nuembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner un nombre de gagnants*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(nuembed)
            return;
        }
        let mess = args[2]
        mess = mess.replace(/-/g, '')
        mess = parseInt(mess)
        mess = mess.toString()
        if (mess === 'NaN') {
            let nueembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Vous devez entrer un nombre*`).setFooter(`TADAA | v${json.version}`)
            return message.channel.send(nueembed);
        } else {
            parseInt(mess)
            Math.trunc(mess);
            manager.edit(args[0], {
                newWinnerCount: mess,
                addTime: 5000
            }).then(() => {
                message.react('✅');
                let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} *La modification sera effectué à la prochaine mise à jour du message*`).setFooter(`TADAA | v${json.version}`)
                message.channel.send(yembed)
            }).catch((err) => {
                message.react('❌');
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Aucun giveaway trouvé avec cet identifiant*`).setFooter(`TADAA | v${json.version}`)
                message.channel.send(noembed)
            });
        }
    } else if (args[1] === 'prix') {
        if (!args[2]) {
            let noaembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner le nouveau prix*`).setFooter(`TADAA | v${json.version}`)
            return message.channel.send(noaembed);
        }
        let prix = message.content.replace(`${pf}edit`, ``)
        prix = prix.replace(`${args[0]}`, '')
        prix = prix.replace(`prix`, '');
        prix = prix.replace(`   `, '')
        manager.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} *La modification sera effectué à la prochaine mise à jour du message*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(yembed)
        }).catch((err) => {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Aucun giveaway trouvé avec cet identifiant*`).setFooter(`TADAA | v${json.version}`)
            message.channel.send(noembed)
        });
    } else {
        let noedmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Cette option n'est pas reconnue, veuillez entrer une option valide* (gagnants, prix)`).setFooter(`TADAA | v${json.version}`)
        message.channel.send(noedmbed)
    }
}
module.exports.help = {
    name: "edit"
}