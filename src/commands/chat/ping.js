const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');

module.exports = class Ping extends BaseCommand {
    constructor() {
        super('ping', 'bot', []);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        message.channel.send(`Mi ping es de \`${client.ws.ping}\``)
    }
}