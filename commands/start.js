'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const fs = require('fs');
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
    let opembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Une opération est déà en cours d'éxécution*`).setFooter(`TADAA | v${json.version}`)
    let embed;
    if (!message.guild.member(client.user).hasPermission(19456)) return (message.channel.send(permembed));
    if (!args[0]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Syntaxe: ${pf}start #salon <durée> <nombre de gagnant> <prix>*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    let channel = message.mentions.channels.first()
    if (!channel) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Vous devez renseigner un salon*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    if (channel.type !== 'text') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Vous devez renseigner un salon __textuel__*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    let duration = args[1]
    if (!duration) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner une durée*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    let timems = ms(duration)
    if (!timems) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez rentrer une durée valide (exemple: 10s, 10m, 10d)*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    } else {
        duration = duration.replace(/-/g, '')
    }
    let winners = args[2]
    if (!winners) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner le nombre de gagnants*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    winners = winners.replace(/-/g, '')
    winners = parseInt(winners)
    winners = winners.toString()
    if (winners === 'NaN') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Vous devez renseigner un nombre*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    } else {
        winners = parseInt(winners)
        winners = Math.trunc(winners);
    }
    let prize = message.content.replace(`${pf}start`, '')
    prize = prize.replace(args[0], '')
    prize = prize.replace(args[1], '')
    prize = prize.replace(args[2], '')
    prize = prize.replace('    ', '')
    if (prize.lenght > 100) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Le prix ne peut pas dépasser plus de 100 caractères*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    if (!args[3]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Veuillez renseigner un prix*`).setFooter(`TADAA | v${json.version}`)
        return (message.channel.send(embed));
    }
    manager.start(channel, {
        time: ms(duration),
        IsRequiredRole: false,
        requiredRole: null,
        prize: prize,
        winnerCount: parseInt(winners)
    }).then((gData) => {
        console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
        let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${okay} *Le giveaway a bien été lançé dans le salon <#${gData.channelID}>*`).setFooter(`TADAA | v${json.version}`)
        message.channel.send(yembed)
    }).catch((err) => {
        message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} *Aucun giveaway trouvé avec cet identifiant*`).setFooter(`TADAA | v${json.version}`)
        message.channel.send(noembed)
    });
}
module.exports.help = {
    name: "start"
}