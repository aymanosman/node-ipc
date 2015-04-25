// It seams that mkChild1 + mkChild2 are equivalent, but mkChild3 does not have
// a pid prop set.
var child = mkChild2(); // experiment with different different children :P
console.log("Spawned child pid:", child.pid);

// listening for messages from the child process
child.on('message', function(msg) {
  console.log('PARENT GOT message', msg);
});

// sending a message to the child
child.send({
  message: 'I am your father!'
});
console.log('parent exit');

function mkChild1() {
  return require('child_process').fork('./child');
}

function mkChild2() {
  var spawn = require('child_process').spawn;
  return spawn('node', ['child.js'], {
    // The first three 'file-descriptors' correspond to the standard stdin,
    // stdout and stderr streams, while any additional items are provided to
    // the child as extras. 'ipc' enables "child.send" on the parent and
    // "process.send" on the child. I don't know if pipes could be used to
    // acheive similar results.
    stdio: [0, 1, 2, 'ipc']
  });
}

// This child process will automatically respawn thanks to 'forever'
// It seams that a 'forever' child does not have a pid property.
function mkChild3() {
  var forever = require('forever-monitor');

  child = new(forever.Monitor)('child.js', {
    fork: true // This enables ipc I presume in a similar fashion as mkChild2
  });

  child.start();
  return child;
}
