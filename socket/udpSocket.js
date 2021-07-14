'use strict';

module.exports = () => {
  var dgram = require('dgram'),
    udpServer = dgram.createSocket('udp4');
  
  udpServer.on('listening', () => {
      console.log(`udp server listening on ${process.env.UDP_PORT}.`);
  });
  
  udpServer.on('message', (msg, rinfo) => {
      if(msg.toString() === 'Sight++') {
          udpServer.send('approve');
      } 
  });

  udpServer.on('error', err => {
    console.log(err);
  });
  
  udpServer.bind(process.env.UDP_PORT, process.env.UDP_SERVER_HOST);
}
