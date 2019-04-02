const net = require('net');

/**
 * Finds a free port
 *
 * @param {number} startingPort
 * @returns {Promise} Promise returning the free port
 */
function findPort(startingPort) {
  return new Promise((resolve, reject) => {
    function snoopPort(port) {
      const server = net.createServer();
      server.once('error', err => {
        if (err.code === 'EADDRINUSE') {
          snoopPort(port + 1);
        } else {
          reject(err);
        }
        server.close();
      });
      server.once('listening', () => {
        resolve(port);
        server.close();
      });
      server.listen(port);
    }

    snoopPort(startingPort);
  });
}

module.exports = findPort;
