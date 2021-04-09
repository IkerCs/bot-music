const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');
const humanize_duration = require('humanize-duration');

module.exports = class Queue extends BaseCommand {
    constructor() {
        super('queue', 'music', ['q']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        let queue = client.queue.get(message.guild.id);

        if(!queue) return message.channel.send(`:x: | No estoy reproduciendo musica en este momento`);

        let i = 1;

        let list = queue.songs.slice(1).map(song => {
            if(i > 16) return;
            i++;
            return `[${i}]: 🎶 ${song.song.title} - ⏱ ${time(song.song.length)} - 👤 ${song.message.author}`;
        }).join('\n');
        let line = '================================'

        let streamTime = time(Math.trunc(queue.connection.dispatcher.streamTime / 1000))
        let actualPlaying = `[ACTUAL]: 🔊 ${queue.songs[0].song.title} - ⏱ ${streamTime} - 👤 ${queue.songs[0].message.author} ${'\n' + line}`;

        message.channel.send(`[Lista de canciones]\n${actualPlaying}\n\n${list}`, {code: 'md'})
    }
}

function time(seconds){
    return humanize_duration(seconds * 1000, {
        'conjunction': ' y ',
        'language': 'es',
        'round': true,
        'units': ['h', 'm', 's'],
        'serialComma': false
    });
}