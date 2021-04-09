const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');

module.exports = class Pause extends BaseCommand {
    constructor() {
        super('pause', 'music', ['pausar']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        let queue = client.queue.get(message.guild.id);

        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) return message.channel.send(`:x: | No estas conectado a un canal de voz`);

        if(!queue) return message.channel.send(`:x: | No estoy reproduciendo musica en este momento`);
        if(!queue.playing) return message.channel.send(`:x: | La cancion actual ya se encuentra pausada`);

        await queue.connection.dispatcher.pause();
        queue.playing = false;
        message.channel.send(`:white_check_mark: | Se ha pausado la reproduccion actual`)
    }
}