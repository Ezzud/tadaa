const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER']
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
const storage = require("quick.db");
const db = new storage.table('giveaways')
if(!db.get("giveaways")) db.set("giveaways", []);
 
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
 
    // This function is called when the manager needs to get all the giveaway stored in the database.
    async getAllGiveaways(){
        // Get all the giveaway in the database
        return db.get("giveaways");
    }
 
    // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
    async saveGiveaway(messageID, giveawayData){
        // Add the new one
        db.push("giveaways", giveawayData);
        // Don't forget to return something!
        return true;
    }
 
    async editGiveaway(messageID, giveawayData){
        // Gets all the current giveaways
        const giveaways = db.get("giveaways");
        // Remove the old giveaway from the current giveaways ID
        const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
        // Push the new giveaway to the array
        newGiveawaysArray.push(giveawayData);
        // Save the updated array
        db.set("giveaways", newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }
 
    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageID){
        // Remove the giveaway from the array
        const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
        // Save the updated array
        db.set("giveaways", newGiveawaysArray);
        // Don't forget to return something!
        return true;
    }
 
};
let date = new Date();
date.setHours(date.getHours() + 2);
let path = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
let logs;
let logstr;
try {
    if (fs.existsSync(path)) {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
    } else {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
    }
} catch (err) {
    console.error(err);
}
const logs_path = logstr;
client.logs_path = logs_path;
setInterval(async () => {
    let date = new Date();
date.setHours(date.getHours() + 2);
let path = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
let logs;
let logstr;
try {
    if (fs.existsSync(path)) {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
    } else {
        logs = new FileSync(`./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`);
        logstr = `./logs/${moment(date).format('MM-D-YYYY')}-shard${client.shard.ids[0]}.log`;
    }
} catch (err) {
    console.error(err);
}
client.logs_path = logstr;
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${logstr}`, `\n${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
}, 300000);
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${logs_path}`, `\n${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
console.log(`Logs path set to: ${logstr}`)
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







const manager = new GiveawayManagerWithOwnDatabase(client, {
    storage: `./data/storage/${client.shard.ids[0]}/giveaways.json`,
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false,
        exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
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
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./commands/");
            return;
        }
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            console.log(`\x1b[36m[COMMANDES]` + ` \x1b[0mFichier ${f}` + `\x1b[0m`);
            client.commands.set(props.help.name, props);
        });
        console.log(`\x1b[32m` + ` \x1b[32mChargement des commandes effectué` + `\x1b[0m`);
    });
}

function _eventHandler() {
    fs.readdir('./events/', async (err, f) => {
        if (err) console.log(err);
        let jsfile = f.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
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
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "json");
        if (jsfile.length <= 0) {
            console.log(`\x1b[31m[DATA]` + ` \x1b[31mAucun fichier trouvé dans ./data/${client.shard.ids[0]}/` + `\x1b[0m`);
        } else {
            jsfile.forEach(async (f, i) => {
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
manager.on('end', async (giveaway, winners) => {
    let gld = client.guilds.cache.get(giveaway.guildID)
    if (!gld) return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${giveaway.guildID}.json`);
    var database = low(adapting);
    let dmWin = await database.get(`data.isDMWin`).value()
    if (dmWin === undefined) {
        dmWin = true
        await database.set(`data.isDMWin`, true).write()
    }
    if (dmWin === true) {
    	let lang = await database.get(`data.lang`).value()
    	if(!lang) {
    		lang = "fr_FR"
    	}
    	lang = require(`./lang/${lang}.json`)
        const embedwin = new Discord.MessageEmbed().setAuthor(`${lang.winText}`, icon_url = 'https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png').setColor('#EFE106').addField(`\u200B`, `${lang.winPrize.split("%prize%").join(giveaway.prize)}\n[${lang.winButton}](https://discordapp.com/channels/${giveaway.channel.guild.id}/${giveaway.channel.id}/${giveaway.messageID}) pour accéder au message`)
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
if (client.shard.ids[0] === 0) {
    console.log(`\n----------------------------------\n`)
}
console.log(`[DISCORD.JS] Connexion...`);