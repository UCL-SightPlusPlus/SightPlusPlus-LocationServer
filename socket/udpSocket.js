'use strict';

const port = process.env.UDP_PORT || 7979;

module.exports = () => {
  const dgram = require('dgram');
  const udpServer = dgram.createSocket('udp4');

  udpServer.on('listening', () => {
    console.log(`UDP server listening on ${port}.`);
  });

  udpServer.on('message', (msg, rinfo) => {
    if (msg.toString() === 'Sight++') {
      udpServer.send('approve');
    }
  });

  udpServer.on('error', (err) => {
    console.log(err);
  });

  udpServer.bind(port, process.env.UDP_SERVER_HOST);
};
