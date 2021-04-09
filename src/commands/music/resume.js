const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');

module.exports = class Resume extends BaseCommand {
    constructor() {
        super('resume', 'music', ['reanudar']);
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
        if(queue.playing) return message.channel.send(`:x: | La cancion actual ya se encuentra pausada`);

        await queue.connection.dispatcher.resume();
        queue.playing = true;
        message.channel.send(`:white_check_mark: | Se ha reanudado la reproduccion actual`)
    }
}