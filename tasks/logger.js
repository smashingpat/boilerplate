const chalk = require('chalk');

const typeColors = {
    log: 'white',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
};

function createTimestamp(date = new Date()) {
    const hh = date.getHours().toString().padEnd(2, '0');
    const mm = date.getMinutes().toString().padEnd(2, '0');
    const ss = date.getSeconds().toString().padEnd(2, '0');

    return [hh, mm, ss].join(':');
}

function createLogger(type) {
    const typeColor = typeColors[type] || typeColors.log;

    return function log(...args) {
        console.log(
            chalk.gray(`[${createTimestamp()}]`),
            chalk[typeColor](type),
            ...args
        );
    }
}

const logger = {
    log: createLogger('log'),
    info: createLogger('info'),
    warn: createLogger('warn'),
    error: createLogger('error'),
};

module.exports = logger;
