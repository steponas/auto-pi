module.exports = {
  log: (...args) => {
    const ts = (new Date()).toISOString();
    console.log(`[${ts}] `, ...args);
  },
};
