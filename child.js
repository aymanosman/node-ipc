var express = require('express');
var port = process.env.PORT || 3333;

app = express();
server = app.listen(port);
console.log('listening on port ' + port);

server.on('request', function(req) {
  // Send messages to the parent
  if (process.send) {
    process.send({
      event: 'request',
      message: 'got a request path=' + req.url,
    });
  }
});

// Listen for messages from the parent
process.on('message', function(msg) {
  console.log('CHILD GOT MESSAGE:', msg);
});

if (process.send) {
  process.send({pid: process.pid});
}

