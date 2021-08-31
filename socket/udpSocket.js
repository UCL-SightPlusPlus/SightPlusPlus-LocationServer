'use strict';

const port = process.env.UDP_PORT || 7979;

/**
 * Starts the UDP Server so that the users's devices can connect to the server.
 */
module.exports = () => {
  const dgram = require('dgram');
  const udpServer = dgram.createSocket('udp4');

  udpServer.on('listening', () => {
    console.log(`UDP server listening on ${port}.`);
  });

  udpServer.on('message', (msg, rinfo) => {
    if (msg.toString() === 'Sight++') {
      udpServer.send('approve', rinfo.port, rinfo.address);
    }
  });

  udpServer.on('error', (err) => {
    console.log(err);
  });

  // emits after the socket is closed using socket.close();
  udpServer.on('close', function() {
    console.log('Socket is closed !');
  });

  udpServer.bind(port);
};
