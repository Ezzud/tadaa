const { Intents } = require('discord.js');
const Discord = require("discord.js");
const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'REACTION', 'GUILD_MEMBER'],
    disableMentions: "everyone"
});
const selectMenuAPI = require("./src/selectMenuAPI")
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
    warn: "732581316217929782",
    online: "886211570693193748",
    dnd: "886211570705788938",
    afk: "886211547117027339",
};

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}







const manager = new GiveawaysManager(client, {
    default: {
        botsCanWin: false,
        reaction: "🎁"
    }
});



    client.nope = getEmoji("nope");
        client.info = getEmoji("info");
        client.okay = getEmoji("okay");
        client.what = getEmoji("what");
        client.warning = getEmoji("warn");
        client.online = getEmoji("online");
        client.dnd = getEmoji("dnd");
        client.afk = getEmoji("afk");
        client.loadings = `<a:8299_Loading:688433071573565440>`;    
client.giveawaysManager = manager;
console.log(`\x1b[34m[MANAGER]` + ` \x1b[0mManager pour Shard ${client.shard.ids[0]} activé` + `\x1b[0m`);
// START
launch().then(console.log(`\x1b[0m[Statut]` + ` \x1b[32m ON` + `\x1b[0m`));
async function launch() {
    await _eventHandler();
    await _commandHandler();
    await _dataHandler();
    client.selectMenu = new selectMenuAPI(client);
}
console.log(`\x1b[34m[API]` + ` \x1b[0mConnexion au shard #${client.shard.ids[0]} en cours...` + `\x1b[0m`)
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
            console.log("./commands/ is empty!");
            return;
        }
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            console.log(`\x1b[36m[COMMANDS]` + ` \x1b[0mCommand file: ${f}` + `\x1b[0m`);
            client.commands.set(props.help.name, props);
        });
        console.log(`\x1b[32m` + ` \x1b[32mSuccesfully loaded \x1b[33m${jsfile.length} \x1b[32mcommands` + `\x1b[0m`);
    });
}

function _eventHandler() {
    fs.readdir('./events/', async (err, f) => {
        if (err) console.log(err);
        let jsfile = f.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) {
            console.log("./events/ is empty!");
            return;
        }
        f.forEach((f) => {
            const events = require(`./events/${f}`);
            console.log(`\x1b[35m[EVENTS]` + ` \x1b[0mEvent file: ${f}` + `\x1b[0m`);
            const event = f.split(".")[0];
            client.on(event, events.bind(null, client));
        });
        console.log(`\x1b[32m` + ` \x1b[32mSuccesfully loaded \x1b[33m${jsfile.length} \x1b[32mevents` + `\x1b[0m`);
    });
}

function _dataHandler() {
    if(client.shard.ids[0] !== 0) return;
    var data = new storage.table("serverInfo")
    data.all().forEach(async database => {
        console.log(`\x1b[33m[DATA]` + ` \x1b[37mTable with ID: ${database.ID}` + `\x1b[0m`);
        if(await data.get(`${database.ID}.creation`) !== "off") {
            await data.set(`${database.ID}.creation`, 'off')  
        }
                  
    })
    console.log(`\x1b[32m` + ` \x1b[32mSuccesfully loaded \x1b[33m${data.all().length} \x1b[32mdatabase tables` + `\x1b[0m`);
}
manager.on('end', async (giveaway, winners) => {
    let gld = client.guilds.cache.get(giveaway.guildID)
    if (!gld) return;
    var data = new storage.table("serverInfo")
    let dmWin = await data.get(`${giveaway.guildID}.isDMWin`)
    if (dmWin === undefined) {
        dmWin = true
        await data.set(`${giveaway.guildID}.isDMWin`, true)
    }
    if (dmWin === true) {
    	let lang = await data.get(`${giveaway.guildID}.lang`)
    	if(!lang) {
    		lang = "fr_FR"
    	}
    	lang = require(`./lang/${lang}.json`)
        const embedwin = new Discord.MessageEmbed().setAuthor(`${lang.winText}`, 'https://ezzud.fr/images/openedFixed.png')
        .setColor('#96F221').setDescription(`${lang.winPrize.split("%prize%").join(giveaway.prize).split("%server%").join(gld.name)}`)
        .addField(`\u200B`, `${lang.winButton.split("%link%").join(`https://discordapp.com/channels/${giveaway.channel.guild.id}/${giveaway.channel.id}/${giveaway.messageID}`)} ${lang.reactErrorMessage}`)
        winners.forEach((member) => {
            let usr = gld.members.cache.get(member)
            if(usr) usr.send({ embeds: [embedwin]});
            
        });
    }
    console.log(`- Fin d'un giveaway dans ${gld.name}`)
});
client.login(settings.token);
/*/

        Partie READY

/*/
console.log(`\x1b[34m[API]` + `\x1b[37m Connexion...` + `\x1b[0m`);
client.time = new Date()