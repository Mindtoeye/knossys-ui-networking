import WebSocket, { WebSocketServer } from 'ws';

import KUIServer from '../../lib/components/KUIServer';

// https://github.com/websockets/ws/blob/master/doc/ws.md

console.log ("Starting server ...");

const server = new KUIServer ();
const wss = new WebSocketServer({ port: 8072 });

/**
 *
 */
function sendMessage (aMessage) {

}

wss.on('connection', function connection(ws, req) {
  ws.on('message', function message(data) {    
    server.processData (this,"" + data);
  });
});

/*
wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;

  console.log ("on (connection): " + ip);
});

wss.on('open', function open() {
  console.log("on (open)");

  ws.send('something');
});

wss.on('close', function close() {
  console.log('on (close)');

});

wss.on('message', function message(data) {
  console.log("on (message)");
  console.log('received: %s', data);
});
*/
