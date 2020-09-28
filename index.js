const Discord = require("discord.js");
const client = new Discord.Client({
 partials: ['MESSAGE', 'REACTION']
});
const ms = require('ms');
const settings = require('./config.json');
const fs = require('fs');
const GiveawaysManager = require('./src/Manager');
const EditJsonFile = require('edit-json-file');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const moment = require('moment');
const json = require('./package.json')
var util = require('util');
const log_stdout = process.stdout;
    
const GiveawayManagerWithShardSupport = class extends GiveawaysManager {

    async refreshStorage(){
        return client.shard.broadcastEval(() => this.giveawaysManager.getAllGiveaways());
    }
 
};



let date = new Date();
date.setHours( date.getHours() + 2 );
let path = `./logs/${moment(date).format('MM-D-YYYY-hh-mm')}-shard${client.shard.ids[0]}.log`;
let logs;
let logstr;
try
{
    if(fs.existsSync(path)) {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY-hh-mm')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY-hh-mm')}-shard${client.shard.ids[0]}.log`;
    } else {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY-hh-mm')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY-hh-mm')}-shard${client.shard.ids[0]}.log`;
    }
} catch (err) {
    console.error(err);
}
const MyConsole = new console.Console(fs.createWriteStream(`${logstr}`));
console.log(`Logs path set to: ${logstr}`)

console.log = function(d) {
    let date = new Date();
    date.setHours( date.getHours() + 2 ); //
    MyConsole.log(`${moment(date).format('MM-D-YYYY hh:mm')} | ` + d);
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');

};

let emojiMap = {
  link: "732605373185261629",
  dev: "732605373185261608",
  sharding: "732605372954575029",
  computer : "732607541061877760",
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
const manager = new GiveawaysManager(client, {
    storage: `./data/storage/${client.shard.ids[0]}/giveaways.json`,
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: [ "MANAGE_MESSAGES", "ADMINISTRATOR" ],
        embedColor: "#4FCAF1",
        reaction: "🎁"
    }
});
client.giveawaysManager = manager;
console.log(`\x1b[34m[MANAGER]` + ` \x1b[0mManager pour Shard  Enabled` + `\x1b[0m`);
console.log(`\x1b[34m[MANAGER]` + ` \x1b[0mStorage location: ${manager.options.storage}` + `\x1b[0m`)



// START

launch().then(console.log(`\x1b[0m[Statut]` + ` \x1b[32m ON` + `\x1b[0m`));



async function launch() {
    await _eventHandler();
    await _commandHandler();
    await _dataHandler();
}

/*/

    Configuration et fonctions

/*/
client.commands = new Discord.Collection();
client.events = new Discord.Collection();


function _commandHandler() {
    fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Aucun fichier trouvé dans ./commands/");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`\x1b[36m[COMMANDES]` + ` \x1b[0mFichier ${f}` + `\x1b[0m`);
    client.commands.set(props.help.name, props);
  });
  console.log(`\x1b[32m` + ` \x1b[32mChargement des commandes effectué` + `\x1b[0m`);
});
}


function _eventHandler() {
    fs.readdir('./events/',async (err, f) => { 
  if(err) console.log(err);
  let jsfile = f.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Aucun fichier trouvé dans ./events/");
    return;
  } 
  f.forEach((f) => {
      const events = require(`./events/${f}`);
      console.log(`\x1b[32m[EVENTS]` + ` \x1b[0mFichier ${f}` + `\x1b[0m`);
      const event = f.split(".")[0];

    client.on(event, events.bind(null, client));
    });
  console.log(`\x1b[32m` + ` \x1b[32mChargement des events effectué` + `\x1b[0m`);
});
}

function _dataHandler() {
fs.readdir(`./data/${client.shard.ids[0]}/`, (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "json");
  if(jsfile.length <= 0){
    console.log(`\x1b[31m[DATA]` + ` \x1b[31mAucun fichier trouvé dans ./data/${client.shard.ids[0]}/` + `\x1b[0m`);
  } else {
  jsfile.forEach(async (f, i) =>{
    let props = require(`./data/${client.shard.ids[0]}/${f}`);
    let dbid = f.replace(".json", ``)
    console.log(`\x1b[33m[DATA]` + ` \x1b[32mFichier de données ${f}` + `\x1b[0m`);
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${f}`);
    var database = low(adapting);
    await database.set(`data.creation`, 'off').write()
    await database.set(`data.channel`, 'Erreur!').write()
    await database.set(`data.time`, 'Erreur!').write()
    await database.set(`data.winnerstr`, 'Erreur!').write()
    await database.set(`data.price`, 'Erreur!').write()

  });
  console.log(`\x1b[32m` + ` \x1b[32mChargement des fichiers de données effectué` + `\x1b[0m`);
}
});
}



manager.on('end',async (giveaway, winners) => {
    let gld = client.guilds.cache.get(giveaway.guildID)
    if(!gld) return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${giveaway.guildID}.json`);
    var database = low(adapting);  
    let dmWin = await database.get(`data.isDMWin`).value()
    if(dmWin === undefined) {
        dmWin = true
        await database.set(`data.isDMWin`, true).write()
    }
    if(dmWin === true ) {
    const embedwin = new Discord.MessageEmbed()
    .setAuthor(`Tu viens de remporter un giveaway!`, icon_url='https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png')
    .setColor('#EFE106')
    .addField(`\u200B`, `Tu viens de remporter le prix \`${giveaway.prize}\`\n[Clique ici](https://discordapp.com/channels/${giveaway.channel.guild.id}/${giveaway.channel.id}/${giveaway.messageID}) pour accéder au message`)
       winners.forEach((member) => {
          member.send(embedwin)
       });
    }
    console.log(`- Fin d'un giveaway dans ${gld.name}`)
  });

client.login(settings.token);



/*/

        Partie READY

/*/
    if(client.shard.ids[0] === 0) {
        console.log(`\n----------------------------------\n`)
    }
console.log(`[DISCORD.JS] Connexion...`);






































/*/
client.on('message', async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
        let pf = await database.get(`data.prefix`).value()
        if(!pf) {
            pf = `t!`
            await database.set(`data.prefix`, pf).write()
        }


    if(message.content.startsWith('<@!732003715426287676>')) {
        var embed = new Discord.MessageEmbed()
        .setAuthor(`TADAA`, client.user.avatarURL)
        .setDescription(`Préfixe: **${pf}**\n\n*Faites ${pf}help pour plus d'infos*`)
        .setColor(`#F67272`)
        .setTimestamp()
        .setFooter(`TADAA |  créé par ezzud`, message.author.avatarURL)
        message.channel.send(embed)
    }


    if(message.content.startsWith(pf)) {
    let args = message.content.slice(pf.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    const nope = getEmoji("nope")
    const info = getEmoji("info")
    const okay = getEmoji("okay")
    const what = getEmoji("what")
    const warning = getEmoji("warn")
  let commande_file = client.commands.get(command);
  if(commande_file) commande_file.run(client,pf,message,args,nope,info,okay,what,warning,manager0, manager1, manager2, json);
}

});
/*/















































































































































































/*/client.on('ready', async () => {

fs.readdir(`./data/${client.shard.ids[0]}/`, (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "json");
  if(jsfile.length <= 0){
    console.log(`Aucun fichier trouvé dans ./data/${client.shard.ids[0]}/`);
  } else {
  jsfile.forEach(async (f, i) =>{
    let props = require(`./data/${client.shard.ids[0]}/${f}`);
    let dbid = f.replace(".json", ``)
    console.log(`\x1b[31m[RESET]` + ` \x1b[0mFichier ${f}`);
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${f}`);
    var database = low(adapting);
    await database.set(`data.creation`, 'off').write()
    await database.set(`data.channel`, 'Erreur!').write()
    await database.set(`data.time`, 'Erreur!').write()
    await database.set(`data.winnerstr`, 'Erreur!').write()
    await database.set(`data.price`, 'Erreur!').write()

  });
}
});



        let stv;
        if(client.guilds.size <= 1) {
            stv = 'serveur'
        } else {
            stv = 'serveurs'
        }
    console.log(`\x1b[32m[SHARD]` + ` \x1b[0mSHARD #${client.shard.ids[0]} OPERATIONNEL \n[SERVER] Regroupe ${client.guilds.size} ${stv}\n\n----------------------------------\n`);
    await sleep(15000)
    let count = 0;
let values = await client.shard.broadcastEval(`
    [
        this.shard.id,
        this.guilds.size
    ]
`);
// Make a final string which will be sent in the channel
// For each shard data
values.forEach((value) => {
    // Add the shard infos to the final string
    count = count + 1
});
    let prereq;
    prereq = await client.shard.fetchClientValues('guilds.size');
    prereq = prereq.reduce((p, n) => p + n, 0);

        await client.user.setStatus('dnd')
        await client.user.setPresence({
            game: {
                name: `@TADAA | Shard ${count}/${client.shard.count} | ${prereq} serveurs | v${json.version} | Shard #${client.shard.ids[0]}`,
                type: "PLAYING",
            }
        });
    setInterval(async () => {
    let count2 = 0;
let values2 = await client.shard.broadcastEval(`
    [
        this.shard.id,
        this.guilds.size
    ]
`);
// Make a final string which will be sent in the channel
// For each shard data
values2.forEach((value) => {
    // Add the shard infos to the final string
    count2 = count2 + 1
});
    let req;
    req = await client.shard.fetchClientValues('guilds.size');
    req = req.reduce((p, n) => p + n, 0);
        await client.user.setStatus('dnd')
        await client.user.setPresence({
            game: {
                name: `@TADAA | Shard ${count2}/3 | ${req} serveurs | v${json.version}`,
                type: "PLAYING",
            }
    
        });
        console.log(`----------------------------------\nSHARD #${client.shard.ids[0]} - Presence actualisée\n----------------------------------`)

    }, 300000);
});/*/

/*/

	Anti-Crash

/*/

/*/


	Partie MESSAGES


/*//*/
client.on('message', async message => {

})

client.on("message",async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(message.content.startsWith('<@!732003715426287676>')) {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
        let pf = await database.get(`data.prefix`).value()
        if(!pf) {
            pf = `t!`
            await database.set(`data.prefix`, pf).write()
        }
        var embed = new Discord.MessageEmbed()
        .setAuthor(`TADAA`, client.user.avatarURL)
        .setDescription(`Préfixe: **${pf}**\n\n*Faites ${pf}help pour plus d'infos*`)
        .setColor(`#F67272`)
        .setTimestamp()
        .setFooter(`TADAA |  créé par ezzud`, message.author.avatarURL)
        message.channel.send(embed)
    }
})
/*/




/*/
client.on('guildCreate',async guild => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${guild.id}.json`);
    var database = low(adapting);  
    await database.set(`data.channel`, `Erreur!`).write()
    await database.set(`data.time`, `Erreur!`).write()
    await database.set(`data.winnerstr`, `Erreur!`).write()
    await database.set(`data.price`, `Erreur!`).write()
    await database.set(`data.creation`, `off`).write()
    await database.set(`data.prefix`, `t!`).write()
    await database.set(`data.isrequiredrole`, 'Erreur!').write()
    await database.set(`data.requiredrole`, 'Erreur!').write()
    await database.set(`data.isDMWin`, true).write()
    return console.log(`- [+] Ajouté sur ${guild.name}`);
});
client.on('guildDelete', async guild => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${guild.id}.json`);
    var database = low(adapting);
	await database.unset(`data`).write()
    return console.log(`- [-] Retiré de ${guild.name}`);
});/*/
    
 


// ANCIEN CODE


/*/client.on("message",async (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
    let pf = await database.get(`data.prefix`).value()
    if(!pf) {
        pf = `t!`
        await database.set(`data.prefix`, pf).write()
    }
    if(!message.content.startsWith(pf)) return;
    const args = message.content.slice(pf.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const nope = getEmoji("nope")
    const info = getEmoji("info")
    const okay = getEmoji("okay")
    const what = getEmoji("what")
    const warning = getEmoji("warn")/*/
    /*/if(command === 'start') {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`));
        if(!args[0]) {
            return(message.channel.send(`${nope} **Syntaxe: ${pf}start #salon <durée> <nombre de gagnant> <prix>**`));
        }
        let channel = message.mentions.channels.first()
        if(!channel) {
            return(message.channel.send(`${nope} **Vous devez renseigner un salon**`));
        }
        if(channel.type !== 'text') {
            return message.channel.send(`${nope} **Veuillez mentionner un salon __textuel__**`);
        }
        let duration = args[1]
        if(!duration) return(message.channel.send(`${nope} Veuillez renseigner une durée`));
        let timems = ms(duration)
        if(!timems) {
            return message.channel.send(`${nope} **Veuillez rentrer une durée valide (exemple: 10s, 10m, 10d)**`);
        } else {
            duration = duration.replace(/-/g, '')
        }
        let winners = args[2]
        if(!winners) return(message.channel.send(`${nope} Veuillez renseigner un nombre de gagnants`));
        winners = winners.replace(/-/g, '')
        winners = parseInt(winners)
        winners = winners.toString()
        if(winners === 'NaN') {
            return message.channel.send(`${nope} **Vous devez entrer un nombre**`);
        } else {
            winners = parseInt(winners)
            winners = Math.trunc(winners);
        }
        let prize = message.content.replace(`${pf}start`, '')
        prize = prize.replace(args[0], '')
        prize = prize.replace(args[1], '')
        prize = prize.replace(args[2], '')
        prize = prize.replace('    ', '')
        if(!args[3]) return(message.channel.send(`${nope} Veuillez renseigner un prix`));
    if(client.shard.ids[0] === 0) {
        manager0.start(channel, {
            time: ms(duration),
            prize: prize,
            winnerCount: parseInt(winners)
        }).then((gData) => {
            console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.start(channel, {
            time: ms(duration),
            prize: prize,
            winnerCount: parseInt(winners)
        }).then((gData) => {
            console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.start(channel, {
            time: ms(duration),
            prize: prize,
            winnerCount: parseInt(winners)
        }).then((gData) => {
            console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
        });
    }
    }/*/
    /*/if(command === "create"){
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`));
        if(database.get(`data.creation`).value() === 'on') return(message.channel.send(`${nope} **Une opération est déà en cours d'éxécution**`));
        await database.set(`data.creation`, 'on').write()
        await database.set(`data.channel`, 'Erreur!').write()
        await database.set(`time`, 'Erreur!').write()
        await database.set(`winnerstr`, 'Erreur!').write()
        await database.set(`price`, 'Erreur!').write()
        if(!message.guild.member(message.author).hasPermission(32)) return(message.channel.send(`${nope} **Vous n'avez pas la permission**`));
        var embed = new Discord.MessageEmbed()
        .setTitle(`TADAA`)
        .setThumbnail(client.user.avatarURL)
        .setDescription(`${info} Création d'un giveaway`)
        .setColor(`#FA921D`)
        .addField(`Valeurs:`, `Aucune valeur définie pour le moment :(`)
        .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL)
        await message.channel.send(embed).then(async msg => {
            await message.channel.send(`Tout d'abord, veuillez mentionner le salon dans lequel le giveaway aura lieu.`)
            await message.channel.awaitMessages(async m => m.author.id == message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(mess === "cancel") {
                        await database.set(`data.channel`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        message.channel.send(`${okay} **Opération annulée**`);
                        return msg.delete();    
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('#', '')
                    let channel = message.guild.channels.get(mess)
                    if (!channel) {
                        await database.set(`data.channel`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        return message.channel.send(`${nope} **Veuillez mentionner un salon, opération annulée**`);
                    } else {
                        if(channel.type !== 'text') {
                            await database.set(`data.channel`, 'Erreur!').write()
                            await database.set(`data.creation`, 'off').write()
                            return message.channel.send(`${nope} **Veuillez mentionner un salon __textuel__, opération annulée**`);
                        }
                        await database.set(`data.channel`, channel.id).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setColor(`#`)
                         .setThumbnail(client.user.avatarURL)
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${await database.get(`data.channel`).value()}>`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL)
                        msg.edit(editembed)
                    }   
                        
                }).catch(async () => {
                    message.channel.send(`${nope} **Délai de 60 secondes dépassé, opération annulée**`);
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.channel`, 'Erreur!').write()
                    return;
                });
            if(database.get(`data.channel`).value() === 'Erreur!') {
                await database.set(`data.creation`, 'off').write()
                return;
            }
            if(!message.guild.channels.find(x => x.id === database.get(`data.channel`).value()).memberPermissions(message.guild.member(client.user)).has(19456)) {
                message.channel.send(`:warning: ATTENTION, je n'ai pas les permissions d'envoyer des embeds, d'envoyer des messages ou de voir le salon. Je ne pourrais donc pas commencer le giveaway`)
            }
            await message.channel.send(`Ensuite, veuillez renseigner la durée du giveaway (exemples: 10s, 10m, 10d, 1w)`)
            await message.channel.awaitMessages(async m => m.author.id == message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(mess === "cancel") {
                        await database.set(`data.time`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        message.channel.send(`${okay} **Opération annulée**`);
                        return msg.delete();    
                    }
                    let timems = ms(mess)
                    if(!timems) {
                        await database.set(`data.time`, 'Erreur!').write()
                        return message.channel.send(`${nope} **Veuillez rentrer une durée valide (exemple: 10s, 10m, 10d), opération annulée**`);
                    } else {
                        mess = mess.replace(/-/g, '')
                        await database.set(`data.time`, mess).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .setThumbnail(client.user.avatarURL)
                         .setColor(`#FA921D`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL)
                        await msg.edit(editembed)
                    }
                }).catch(async () => {
                    message.channel.send(`${nope} **Délai de 60 secondes dépassé, opération annulée**`);
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.time`, 'Erreur!').write()
                    return;
                });
            if(database.get(`data.time`).value() === 'Erreur!') {
                await database.set(`data.creation`, 'off').write()
                return;
            }
            await message.channel.send(`Renseignez maintenant le nombre de gagnants qui seront tirés au sort`)
            await message.channel.awaitMessages(async m => m.author.id == message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(mess === "cancel") {
                        await database.set(`data.winnerstr`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        message.channel.send(`${okay} **Opération annulée**`);
                        return msg.delete();    
                    }
                    mess = mess.replace(/-/g, '')
                    mess = parseInt(mess)
                    mess = mess.toString()
                    if(mess === 'NaN') {
                        await database.set('winnerstr', 'Erreur!').write()
                        return message.channel.send(`${nope} **Vous devez entrer un nombre, opération annulée**`);
                    } else {
                        parseInt(mess)
                        Math.trunc(mess);
                        await database.set(`data.winnerint`, mess).write()
                        await database.set(`data.winnerstr`, mess.toString()).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setThumbnail(client.user.avatarURL)
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL)
                        await msg.edit(editembed)
                    }  
                }).catch(async () => {
                    message.channel.send(`${nope} **Délai de 60 secondes dépassé, opération annulée**`);
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.winnerstr`, 'Erreur!').write()
                    return;
                });
                if(database.get(`data.winnerstr`).value() === 'Erreur!') {
                    await database.set(`data.creation`, 'off').write()
                    return;
                }
                await message.channel.send(`Enfin, veuillez rentrer le prix à gagner`)
                await message.channel.awaitMessages(async m => m.author.id == message.author.id,
                    {max: 1, time: 60000}).then(async collected => {
                        let mess = collected.first().content
                        if(mess === "cancel") {
                            await database.set(`data.price`, 'Erreur!').write()
                            await database.set(`data.creation`, 'off').write()
                            message.channel.send(`${okay} **Opération annulée**`);
                            return msg.delete();    
                        }
                        if(mess.lenght > 100) {
                            await database.set(`data.price`, 'Erreur!').write()
                            return message.channel.send(`${nope} **Votre prix fait plus de 100 caractères, opération annulée**`);
                        } else {
                            await database.set(`data.price`, mess).write()
                            var editembed = new Discord.MessageEmbed()  
                             .setTitle(`TADAA`)
                             .setThumbnail(client.user.avatarURL)
                             .setColor(`#FA921D`)
                             .setDescription(`${info} Création d'un giveaway`)
                             .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nPrix: \`${database.get(`data.price`).value()}\` `)
                             .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL)
                            await msg.edit(editembed)
                        }  
                    }).catch(async () => {
                        message.channel.send(`${nope} **Délai de 60 secondes dépassé, opération annulée**`);
                        await database.set(`data.creation`, 'off').write()
                        await database.set(`data.price`, 'Erreur!').write()
                        return;
                    });
                if(database.get(`data.price`).value() === 'Erreur!') { 
                    await database.set(`data.creation`, 'off').write()
                    return;
                }
                msg.delete()
            })
            if(database.get(`data.channel`).value() === 'Erreur!' || database.get(`data.time`).value() === 'Erreur!' || database.get(`data.winnerstr`).value() === 'Erreur!' || database.get(`data.price`).value() === 'Erreur!') {
                await database.set(`data.creation`, 'off').write()
                return;
            }
            var editedembed = new Discord.MessageEmbed()  
             .setTitle(`TADAA`)
             .setDescription(`${what} Confirmation de la création du giveaway`)
             .setThumbnail(client.user.avatarURL)
             .setColor(`#FA921D`)
             .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nPrix: \`${database.get(`data.price`).value()}\` `)
             .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL)
            message.channel.send(editedembed).then(async msg2 => {
                await msg2.react('✅');
                await msg2.react('❌');
                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                await msg2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '✅') {
                            msg2.delete()
    if(client.shard.ids[0] === 0) {
                            await database.set(`data.creation`, `off`).write()
                            manager0.start(message.guild.channels.get(`${database.get(`data.channel`).value()}`), {
                                time: ms(`${database.get(`data.time`).value()}`),
                                prize: `${database.get(`data.price`).value()}`,
                                winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`)
                            }).then(async (gData) => { 
                                console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
                                await database.set(`data.channel`, `Erreur!`).write()
                                await database.set(`data.time`, `Erreur!`).write()
                                await database.set(`data.winnerstr`, `Erreur!`).write()
                                await database.set(`data.price`, `Erreur!`).write()
                            });
    }
    if(client.shard.ids[0] === 1) {
                            await database.set(`data.creation`, `off`).write()
                            manager1.start(message.guild.channels.get(`${database.get(`data.channel`).value()}`), {
                                time: ms(`${database.get(`data.time`).value()}`),
                                prize: `${database.get(`data.price`).value()}`,
                                winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`)
                            }).then(async (gData) => { 
                                console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
                                await database.set(`data.channel`, `Erreur!`).write()
                                await database.set(`data.time`, `Erreur!`).write()
                                await database.set(`data.winnerstr`, `Erreur!`).write()
                                await database.set(`data.price`, `Erreur!`).write()
                            });
    }
    if(client.shard.ids[0] === 2) {
                                await database.set(`data.creation`, `off`).write()
                            manager2.start(message.guild.channels.get(`${database.get(`data.channel`).value()}`), {
                                time: ms(`${database.get(`data.time`).value()}`),
                                prize: `${database.get(`data.price`).value()}`,
                                winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`)
                            }).then(async (gData) => { 
                                console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.get(gData.guildID).name} "`); 
                                await database.set(`data.channel`, `Erreur!`).write()
                                await database.set(`data.time`, `Erreur!`).write()
                                await database.set(`data.winnerstr`, `Erreur!`).write()
                                await database.set(`data.price`, `Erreur!`).write()
                            });
    }
                        } else {
                            msg2.delete()
                            await database.set(`data.channel`, `Erreur!`).write()
                            await database.set(`data.time`, `Erreur!`).write()
                            await database.set(`data.winnerstr`, `Erreur!`).write()
                            await database.set(`data.price`, `Erreur!`).write()
                            await database.set(`data.creation`, `off`).write()
                        }
                    }).catch(() => {
                        message.channel.send(`${nope} **Délai de 60 secondes dépassé, opération annulée**`);
                        return;
                    });
                })
            }/*/
   /*/ if(command === "end") {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!args[0]) {
            message.channel.send(`${nope} **Veuillez renseigner l'identifiant du message**`)
            return;
        }
    if(client.shard.ids[0] === 0) {
        manager0.end(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.end(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.end(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }

        
    }/*/
    /*/if(command === "delete") {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(11264)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, gérer les messages\` pour que ma commande fonctionne`));
        if(!args[0]) {
            message.channel.send(`${nope} **Veuillez renseigner l'identifiant du message**`)
            return;
        }
    if(client.shard.ids[0] === 0) {
        manager0.delete(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.delete(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.delete(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway trouvé avec cet identifiant**`);
        });
    }
        
    }  
    if(command === "reroll") {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`));
        if(!args[0]) {
            message.channel.send(`${nope} **Veuillez renseigner l'identifiant du message**`)
            return;
        }
    if(client.shard.ids[0] === 0) {
        manager0.reroll(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway terminé trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.reroll(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway terminé trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.reroll(args[0]).then(() => {
            message.react('✅');
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway terminé trouvé avec cet identifiant**`);
        });
    }
        
    } 
    if(command === 'edit') {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`));
        if(!args[0]) {
            message.channel.send(`${nope} **Veuillez renseigner l'identifiant du message du giveaway**`)
            return;
        }
        if(!args[1]) {
            message.channel.send(`${nope} **Veuillez renseigner l'option à changer** (gagnants, prix)`)
            return;
        }
        if(args[1] === 'gagnants') {
            if(!args[2]) {
                message.channel.send(`${nope} **Veuillez renseigner un nombre de gagnants**`)
                return;
            }
            let mess = args[2]
            mess = mess.replace(/-/g, '')
            mess = parseInt(mess)
            mess = mess.toString()
            if(mess === 'NaN') {
                return message.channel.send(`${nope} **Vous devez entrer un nombre**`);
            } else {
            parseInt(mess)
            Math.trunc(mess);
    if(client.shard.ids[0] === 0) {
        manager0.edit(args[0], {
            newWinnerCount: mess,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.edit(args[0], {
            newWinnerCount: mess,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.edit(args[0], {
            newWinnerCount: mess,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
            }
        } else if(args[1] === 'prix') {
            if(!args[2]) return(message.channel.send(`${nope} **Veuillez renseigner le nouveau prix**`));
            let prix = message.content.replace(`${pf}edit`, ``)
            prix = prix.replace(`${args[0]}`, '')
            prix = prix.replace(`prix`, '');
            prix = prix.replace(`   `, '')
    if(client.shard.ids[0] === 0) {
        manager0.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 1) {
        manager1.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
    if(client.shard.ids[0] === 2) {
        manager2.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            message.channel.send(`${okay} **Le changement sera effectué dans quelques instant**`)
        }).catch((err) => {
            message.react('❌');
            message.channel.send(`${nope} **Aucun giveaway en cours trouvé avec cet identifiant**`);
        });
    }
        } else {
            message.channel.send(`${nope} **Cette option n'est pas reconnue, veuillez entrer une option valide** (gagnants, prix)`)
        }
    }/*/
  /*/  if(command === 'info') {
var timer = new Date().getTime() - message.createdTimestamp
let uptime = (client.uptime / 1000);
let day = Math.floor(uptime / 86400);
let hour = Math.floor(uptime / 3600);
uptime %= 3600;
let minute = Math.floor(uptime / 60);
let seconde = uptime % 60;
seconde = Math.trunc(seconde)
    let count3 = 0;
let values3 = await client.shard.broadcastEval(`
    [
        this.shard.id,
        this.guilds.size
    ]
`);
// Make a final string which will be sent in the channel
// For each shard data
values3.forEach((value) => {
    // Add the shard infos to the final string
    count3 = count3 + 1
});
  let daym;
  let hourm;
  let minutem;
  let secondem;
  if(day <= 1) {
    daym = 'jour'
  } else {
    daym = 'jours'
  }
  if(hour <= 1) {
    hourm = 'heure'
  } else {
    hourm = 'heures'
  }
  if(minute <= 1) {
    minutem = 'minute'
  } else {
    minutem = 'minutes'
  }
  if(seconde <= 1) {
    secondem = 'seconde'
  } else {
    secondem = 'secondes'
  }
    let req = await client.shard.fetchClientValues('guilds.size');
    req = req.reduce((p, n) => p + n, 0);
  var memory = process.memoryUsage()
  var embed = new Discord.MessageEmbed()
  .setTitle(`Informations du bot`)
  .setColor('#e4b400')
  .setThumbnail(client.user.avatarURL)
  .addField(`${loadings} Ping`, `${timer}ms\n\u200B`, true)
  .addField(`${getEmoji("sharding")} Shards`, `\`${count3}\`/\`${client.shard.count}\` | Shard du serveur: #${client.shard.ids[0]}\n\u200B`, true)
  .addField(`${getEmoji("computer")} Uptime`, `${day} ${daym} ${hour} ${hourm} ${minute} ${minutem} ${seconde} ${secondem}\n\u200B`, false)
  .addField(`${getEmoji("memoire")} Utilisation de la mémoire\u200B`, `\`${bts(memory.heapUsed)}\`/\`2 GB\`\n\u200B`, false)
  .addField(`${getEmoji("dev")} Créateur\u200B`, "ezzud#0001\n\u200B", true)
  .addField(`${getEmoji("link")} Inviter le bot`, `[Cliquez ici](https://discord.com/api/oauth2/authorize?client_id=732003715426287676&permissions=268561440&scope=bot)`, true)
  .addField(`:newspaper: Changelog`, `${json.description}`, false)
  .addField(`:house: Nombre de serveurs`, `\` ${req} \``, true)
  .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL)
  await message.channel.send(embed)
    }/*/
  /*/  if(command === 'reload') {
        if(message.author.id === '638773138712428575') {
            let emoji = loadings
            await message.channel.send(`${emoji} **Redémarrage du shard ${client.shard.ids[0]} en cours...**`)
            let dater = new Date().getTime();
                await console.log(`\x1b[36m%s\x1b[0m`, '[TROSH]', '\x1b[0m',` Redémarrage du shard ${client.shard.ids[0]} en cours...`);
                client.destroy().then(() => {
                    client.login(settings.token).then(() => {
                        let datef = new Date().getTime();
                        let time = datef - dater;
                        time = time / 1000
                        message.channel.send(`${okay} **Redémarrage effectué (Shards: \`${client.shard.count }\`/\`3\`)** (*${time}s*)`)
                    })

                })
            
        }
    }
    if(command === "list") {
        if(message.guild.member(message.author).hasPermission(32) === false) {
        if(message.guild.member(message.author).hasRole(message.guild.roles.find(x => x.name === 'Giveaways'))) {
            console.log('Perms bypass')
        } else { 
            return(message.channel.send(`${nope} **Vous n'avez pas la permission ni le rôle \`Giveaways\`**`));
        }
    }
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`));
    let onServer;
    if(client.shard.ids[0] === 0) {
        onServer = manager0.giveaways.filter((g) => g.guildID === message.guild.id);
    }
    if(client.shard.ids[0] === 1) {
        onServer = manager1.giveaways.filter((g) => g.guildID === message.guild.id);
    }
    if(client.shard.ids[0] === 2) {
        onServer = manager2.giveaways.filter((g) => g.guildID === message.guild.id);
    }
        let onServer2;
        let onServer3;
        let onServer4;
        if(!onServer) {
            onServer = 'Aucun :('
        } else {
            onServer = onServer.map(g => `Prix: \` ${g.prize} \` | Fin: ${moment(g.endAt).format('LLL')}. [Clique pour accéder](https://discordapp.com/channels/${g.guildID}/${g.channelID}/${g.messageID})::`)
            onServer = Array.from(onServer)
            if(onServer[6] !== undefined && onServer[10] !== undefined) {
                onServer2 = onServer.slice(6, 10)
                onServer2 = onServer2.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer2 = `\u200B`;
            }
            if(onServer[11] !== undefined && onServer[15] !== undefined) {
                onServer3 = onServer.slice(11, 15)
                onServer3 = onServer3.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer3 = `\u200B`;
            }
            if(onServer[16] !== undefined && onServer[20] !== undefined) {
                onServer4 = onServer.slice(16, 20)
                onServer4 = onServer4.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer4 = `\u200B`;
            }
            onServer = onServer.slice(0, 5)
            onServer = onServer.toString().replace(/::/g, `\n`).replace(/,/g, ``)
        }
        if(onServer.lenght > 1000) {
            onServer = 'Aucun :('
        }
        if(onServer2.lenght > 1000) {
            onServer2 = `\u200B`
        }
        if(onServer3.lenght > 1000) {
            onServer3 = `\u200B`
        }
        if(onServer4.lenght > 1000) {
            onServer4 = `\u200B`
        }
        var embed = new Discord.MessageEmbed()
        .setAuthor(`Liste des giveaways`)
        .setThumbnail(client.user.avatarURL)
        .setColor(`#F79430`)
        .addField(`\u200B`, onServer)
        .addField(`\u200B`, `${onServer2 || `\u200B`}`)
        .addField(`\u200B`, `${onServer3 || `\u200B`}`)
        .addField(`\u200B`, `${onServer4 || `\u200B`}\n\n\u200B`)
        .addField(`Comment retirer un giveaway de la liste?`, `*la liste ne peut afficher que 20 giveaways, ils ne se suppriment pas lorsque ils sont terminés, pour les supprimer, faites \`${pf}delete <id du message> \`*`)
        .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL)
        .setTimestamp()
        message.channel.send(embed)
    }
    if(command === 'config') {
        if(!message.guild.member(message.author).hasPermission(8)) return(message.channel.send(`${nope} **Vous n'avez pas la permission**`));
        if(!args[0]) {
    let dmWin = await database.get(`data.isDMWin`).value()
    if(!dmWin) {
        dmWin = true
        await database.set(`data.isDMWin`, true).write()
    }
    let dmWinm;
    if(dmWin === true) {
        dmWinm = `Activé!`
    } else if(dwWin === false) {
        dmWinm = `Désactivé!`
    } else {
        dmWinm = `Inconnu!`
    }
            var embed = new Discord.MessageEmbed()
            .setAuthor(`Configuration`)
            .setThumbnail(client.user.avatarURL)
            .setDescription(`Serveur: ${message.guild.name}`)
            .setColor(`#5ED5F5`)
            .addField(`Valeurs`, `Préfixe: **${pf}**\nEnvoi de message privé si un giveaway est gagné: **${dmWinm}**\n\u200B`)
            .addField(`Changer une valeur?`, `${pf}config prefix \`<Nouveau préfixe>\`\n${pf}config dmWin \`<Oui/Non>\``)
            .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL)
            .setTimestamp()
            message.channel.send(embed)
        }
        if(args[0] === 'prefix') {
            if(!args[1]) {
                message.channel.send(`${nope} **Veuillez renseigner un préfixe**`)
                return;
            }
            if(args[1] === await database.get(`data.prefix`).value()) {
                message.channel.send(`${nope} **Le nouveau préfixe est le même que l'ancien**`)
                return;
            }
            await database.set(`data.prefix`, args[1]).write()
            message.channel.send(`${okay} **Le préfixe du bot est désormais** \`${await database.get(`data.prefix`).value()}\``)
        } else if(args[0].toLowerCase() === 'dmwin') {
            if(!args[1]) {
                message.channel.send(`${nope} **Veuillez renseigner une valeur** *(Oui/Non)*`)
                return;
            }
            if(args[1].toLowerCase() === 'oui') {
                if(await database.get(`data.isDMWin`).value() === true) {
                    message.channel.send(`${nope} **Les messages privés sont déjà activés**`)
                    return;
                }
                await database.set(`data.isDMWin`, true).write()
                message.channel.send(`${okay} **L'envoi de message privé aux gagnants est désormais activé**`)
            } else if(args[1].toLowerCase() === 'non') {
                if(await database.get(`data.isDMWin`).value() === false) {
                    message.channel.send(`${nope} **Les messages privés sont déjà désactivés**`)
                    return;
                }
                await database.set(`data.isDMWin`, false).write()
                message.channel.send(`${okay} **L'envoi de message privé aux gagnants est désormais désactivé**`)
            } else {
                message.channel.send(`${nope} Syntaxe: **${pf}config dmWin \`Oui/Non\`**`)
            }
        }
    }/*/
/*/});/*/