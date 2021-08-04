'use strict';

module.exports = () => {
  const dgram = require('dgram');
  const udpServer = dgram.createSocket('udp4');

  udpServer.on('listening', () => {
    console.log(`UDP server listening on ${process.env.UDP_PORT}.`);
  });

  udpServer.on('message', (msg, rinfo) => {
    if (msg.toString() === 'Sight++') {
      udpServer.send('approve');
    }
  });

  udpServer.on('error', (err) => {
    console.log(err);
  });

  udpServer.bind(process.env.UDP_PORT, process.env.UDP_SERVER_HOST);
};
