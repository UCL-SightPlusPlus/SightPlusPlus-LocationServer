'use strict';

module.exports = () => {
  var dgram = require('dgram'),
    udpServer = dgram.createSocket('udp4');
  
  udpServer.on('listening', () => {
      console.log('udp server listening on 7979.');
  });
  
  udpServer.on('message', (msg, rinfo) => {
      if(msg.toString() === 'Sight++') {
          udpServer.send('approve');
      } 
  });

  udpServer.on('error', err => {
    console.log(err);
  });
  
  udpServer.bind(7979, '127.0.0.1');
}
