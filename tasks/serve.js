const cleanDist = require('./lib/cleanDist');
const createServer = require('./lib/server/createServer');

(async () => {
  await cleanDist();
  await createServer();
})();
