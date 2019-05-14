const Logger = {
  log: (...args) => {
    const ts = (new Date()).toISOString();
    // eslint-disable-next-line no-console
    console.log(`[${ts}] `, ...args);
  },
  debug: (...args) => {
    Logger.log(...args);
  },
  error: (...args) => {
    Logger.log(...args);
  },
};

module.exports = Logger;
