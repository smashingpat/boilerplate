const cleanDist = require('./lib/cleanDist');
const buildSource = require('./lib/buildSource');

// set enviroment keys
process.env.NODE_ENV = 'production';

(async () => {
    await cleanDist();
    await buildSource();
})();
