const cleanDist = require('./lib/cleanDist');
const buildSource = require('./lib/buildSource');
const logger = require('./lib/logger');

// set enviroment keys
process.env.NODE_ENV = 'production';

(async () => {
    logger.info('cleaning dist');
    await cleanDist();
    logger.info('building source');
    await buildSource();
    logger.info('done');
})();
