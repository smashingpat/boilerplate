const chalk = require('chalk');
const logUpdate = require('log-update');

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

function createStatusBar() {
  let tasks = [];
  function updateStatusBar() {
    const hasTasks = tasks.length > 0;
    const statusText = [
      chalk.gray('status'),
      hasTasks
        ? chalk.bgGreen.white(' RUNNING ')
        : chalk.bgYellow.black(' DONE '),
      hasTasks
        ? tasks.join(', ')
        : chalk.gray(`last run at ${createTimestamp()}`),
    ].join(' ');
    logUpdate(`${chalk.gray('---')}\n${statusText}`);
  }

  updateStatusBar();

  return {
    taskPending(taskName) {
      tasks.push(taskName);
      updateStatusBar();
    },
    taskResolved(taskName) {
      tasks = tasks.filter(t => t !== taskName);
      updateStatusBar();
    },
    update() {
      updateStatusBar();
    },
    clear() {
      logUpdate.clear();
    },
  };
}

const statusBar = createStatusBar();

/**
 * Creates a log object
 */
function createLogger(type, stream) {
  const typeColor = typeColors[type] || typeColors.log;

  return function log(...args) {
    statusBar.clear();
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
    statusBar.update();
  };
}

const logger = {
  log: createLogger('log', process.stdout),
  info: createLogger('info', process.stdout),
  warn: createLogger('warn', process.stdout),
  error: createLogger('error', process.stdout),
  taskPending: statusBar.taskPending.bind(statusBar),
  taskResolved: statusBar.taskResolved.bind(statusBar),
};

module.exports = logger;
