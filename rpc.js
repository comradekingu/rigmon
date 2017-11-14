const logger = require('./logger.js');
var net = require('net');
var Rig = require('./rig.js');

class Tcp extends Rig{
    constructor(rigName, config, req, refreshMs) {
        super(rigName, refreshMs);
        this.on('refresh', (name) => {
            logger.debug(`Refresh ${name}`);
            this.connect();
        });
        this.config = config;

        this.socket = new net.Socket()
        .on('data', (data) => {
            var parsedData = JSON.parse(data);
            logger.trace("Tcp Data arrived");
            this.emit('data', parsedData);
        })
        .on('close', function() {
            logger.trace('close');
        })
        .on('timeout', function() {
            logger.trace('timeout');
        })
        .on('error', function() {
            logger.trace('error');
        })
        .on('connect', function() {
            logger.trace(`: connected to ${this.remoteAddress} ${this.remotePort}`);
            this.write(req + '\n');
        });
    }

    connect() {
        logger.trace(`connect ${this.config.host}:${this.config.port}`);
        this.socket.connect(this.config.port, this.config.host);
    }
}

module.exports = {
    Tcp: Tcp
};
