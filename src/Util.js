/**
*
*   Original creator: https://github.com/Androz2091/discord-giveaways
*
**/



const Discord = require('discord.js');


const GiveawaysMessages = {
    giveaway: 'Tiens tiens, que vois-je...',
    giveawayEnded: 'Fin du giveaway!',
    timeRemaining: 'Temps restant: **{duration}**',
    inviteToParticipate: 'Réagissez avec 🎁 pour participer!',
    winMessage: 'Félicitations {winners}! Tu remportes: **{prize}**!',
    embedFooter: 'Khallazpaz',
    noWinner: 'Le giveaway a été annulé',
    hostedBy: 'Créateur: {user}',
    winners: 'Gagnant(s)',
    endedAt: 'Fin:',
    units: {
        seconds: 'secondes',
        minutes: 'minutes',
        hours: 'heures',
        days: 'jours',
        pluralS: true
    }
};

const GiveawaysManagerOptions = {
    storage: './giveaways.json',
    updateCountdownEvery: 5000,
    DJSlib: Discord.version.split('.')[0] === '12' ? 'v12' : 'v11',
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        exemptMembers: () => false,
        embedColor: '#FF0000',
        reaction: '🎁'
    }
};

const GiveawayStartOptions = {
    isRequiredRole: false
};

const GiveawayRerollOptions = {
    winnerCount: null,
    messages: {
        congrat: '🎁 Nouveau(x) gagnant(s): {winners}!',
        error: 'Aucun gagnant ne peut être choisi!'
    }
};

const GiveawayEditOptions = {};

module.exports = {
    defaultGiveawaysMessages: GiveawaysMessages,
    defaultGiveawaysManagerOptions: GiveawaysManagerOptions,
    defaultGiveawayRerollOptions: GiveawayRerollOptions
};
