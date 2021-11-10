import WebSocket, { WebSocketServer } from 'ws';

// https://github.com/websockets/ws

console.log ("Starting ...");

/*
const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

*/

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
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