const { Client, Collection } = require('discord.js');
const client = new Client();

const config = require('./config');
const { registerCommands, registerEvents } = require('./src/utils/registry');

async function init(){
    client.prefix = config.prefix;
    client.queue = new Map();
    client.commands = new Collection();
    client.events = new Collection();
    await registerCommands(client, '../commands');
    await registerEvents(client, '../events');
    await client.login(config.token);
}

init();