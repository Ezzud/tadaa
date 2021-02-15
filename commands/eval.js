'use strict';
const Discord = require("discord.js");
const settings = require('../config.json');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
let emojiMap = {
    send: "760111981646184478",
    result: "760111980996067328",
    erreur: "760112864731201576"
};
function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}

module.exports.run = async (client, pf, message, args, manager,json,lang) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    function embed(input, output, error = false) {
        return new Discord.MessageEmbed().setColor(error ? 'ED3316' : '6CDC3F').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`${getEmoji("send")} Entrée`, `\`\`\`${error ? "" : "js"}\n${input}\n\`\`\``).addField(error ? `${getEmoji("erreur")} Erreur` : `${getEmoji("result")} Résultat`, `\`\`\`${error ? "" : "js"}\n${output}\n\`\`\``).setFooter(`TADAA v${json.version}`).setThumbnail(client.user.avatarURL());
    }
    if (message.author.id !== settings.ownerID) return;
    let code = message.content.replace(pf, ``);
    code = code.replace("eval", "");
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
                console.log(err)
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