const chalk = require('chalk');

const typeColors = {
    log: 'white',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
};

/**
 * Create a prettier timestamp
 *
 * @param {Date} date
 */
function createTimestamp(date = new Date()) {
    const hh = date
        .getHours()
        .toString()
        .padStart(2, '0');
    const mm = date
        .getMinutes()
        .toString()
        .padStart(2, '0');
    const ss = date
        .getSeconds()
        .toString()
        .padStart(2, '0');

    return [hh, mm, ss].join(':');
}

/**
 * Creates a log object
 */
function createLogger(type, stream) {
    const typeColor = typeColors[type] || typeColors.log;

    return function log(...args) {
        const logString = [
            chalk.gray(`[${createTimestamp()}]`),
            chalk[typeColor](type),
            ...args,
        ]
            .join(' ')
            .trim();
        if (logString) {
            stream.write(`${logString}\n`);
        }
    };
}

const logger = {
    log: createLogger('log', process.stdout),
    info: createLogger('info', process.stdout),
    warn: createLogger('warn', process.stdout),
    error: createLogger('error', process.stdout),
};

module.exports = logger;
