'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
const settings = require('../config.json')
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
module.exports.run = async (client, pf, message, args, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 2); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    if (message.author.id === settings.ownerID) {
        let emoji = loadings;
        let reloadEmbed = new Discord.MessageEmbed().setColor('D7E921').setDescription(`\u200B`).setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`\nEtat`, `${emoji} Redémarrage du shard \` ${client.shard.ids[0]} \` en cours\n\u200B`).setFooter(`TADAA | v${json.version}`)
        let sendedMessage = await message.channel.send({embeds: [reloadEmbed]});
        let dater = new Date().getTime();
        async function addCommands() {
            await fs.readdir("./commands/", async (err, files) => {
                if (err) console.log(err);
                var jsfile = files.filter(f => f.split(".").pop() === "js");
                if (jsfile.length <= 0) {
                    console.log("../commands/ is empty!");
                    return;
                }
                var f;
                for (f in jsfile) {
                    const commandName = jsfile[f].split(".")[0];
                    delete require.cache[require.resolve(`./${commandName}.js`)];
                    await client.commands.delete(commandName);
                    const props = require(`../commands/${commandName}.js`);
                    await client.commands.set(commandName, props);
                }
                console.log(`\x1b[32m` + ` \x1b[32mSuccesfully reloaded \x1b[33m${client.commands.size} \x1b[32mcommands` + `\x1b[0m`);
            });
        }
        await addCommands()
        let datef = new Date().getTime();
        let time = datef - dater;
        time = time / 1000
        let count = 0;
        let values = await client.shard.fetchClientValues('shard.ids[0]');
        values.forEach((value) => {
            count = count + 1
        });
        let reloadedEmbed = new Discord.MessageEmbed().setColor('5BCA2F').setDescription(`\u200B`).setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`\nEtat`, `${client.okay} Redémarrage du shard \` ${client.shard.ids[0]} \` effectué (*${time}s*)\nCommandes rechargées: **${client.commands.size}**`).addField(`Shards`, `\`${count}\`/\`${client.shard.count}\`\n\u200B`).setFooter(lang.footer.split("%version%").join(json.version))
        await sendedMessage.edit({embeds: [reloadedEmbed]})
    }
}
module.exports.help = {
    name: "reload"
}