const Logger = {
  log: (...args): void => {
    const ts = (new Date()).toISOString();
    // eslint-disable-next-line no-console
    console.log(`[${ts}] `, ...args);
  },
  debug: (...args): void => {
    Logger.log(...args);
  },
  error: (...args): void => {
    Logger.log(...args);
  },
};

export default Logger;
