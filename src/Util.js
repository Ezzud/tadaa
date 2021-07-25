/**
 *
 *   Original creator: https://github.com/Androz2091/discord-giveaways
 *
 **/
const Discord = require('discord.js');
const GiveawaysManagerOptions = {
    DJSlib: Discord.version.split('.')[0] === '12' ? 'v12' : 'v11',
    default: {
        botsCanWin: false,
        reaction: '🎁'
    }
};
module.exports = {
    defaultGiveawaysManagerOptions: GiveawaysManagerOptions,
};