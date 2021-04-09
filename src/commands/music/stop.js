const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');
const Discord = require('discord.js');

module.exports = class Stop extends BaseCommand {
    constructor() {
        super('stop', 'music', ['detener', 'leave']);
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

        await queue.connection.dispatcher.destroy();
        await queue.VoiceChannel.leave();
        message.channel.send(`:white_check_mark: | He detenido la reproduccion de canciones en el servidor`);
    }
}