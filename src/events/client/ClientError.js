const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ErrorEvent extends BaseEvent {
    constructor() {
        super('error');
    }
    async run(client, error) {
        console.log(`Ha sucedido un error de conexión\nPara mayor información: ${error}`)
    }
}