'use strict';
const Discord = require("discord.js");
const settings = require('../config.json');
const util = require('util');
let emojiMap = {
    send: "760111981646184478",
    result: "760111980996067328",
    erreur: "760112864731201576"
};

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager, json, command) => {
    function embed(input, output, error = false) {
        return new Discord.MessageEmbed().setColor(error ? 'ED3316' : '6CDC3F').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`${getEmoji("send")} Entrée`, `\`\`\`${error ? "" : "js"}\n${input}\n\`\`\``).addField(error ? `${getEmoji("erreur")} Erreur` : `${getEmoji("result")} Résultat`, `\`\`\`${error ? "" : "js"}\n${output}\n\`\`\``).setFooter("TADAA | v${json.version}").setThumbnail(client.user.avatarURL());
    }
    if (message.author.id !== settings.ownerID) return;
    let code = message.content.replace(pf, ``);
    code = code.replace(command, ``);
    console.log(code);
    if (!code) return (message.channel.send(`:x: **Aucun code renseigné!**`));
    try {
        const after = eval(code);
        if (after instanceof Promise) {
            after.then(a => {
                message.channel.send({
                    embed: embed(code, a instanceof Object ? util.inspect(a, {
                        depth: 0
                    }) : a)
                });
            }).catch(err => {
                message.channel.send({
                    embed: embed(code, err, true)
                });
            });
        } else {
            message.channel.send({
                embed: embed(code, after instanceof Object ? util.inspect(after, {
                    depth: 0
                }) : after)
            });
        }
    } catch (err) {
        message.channel.send({
            embed: embed(code, err, true)
        });
    }
}
module.exports.help = {
    name: "eval"
}