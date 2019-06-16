export const log = (...args): void => {
  const ts = (new Date()).toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${ts}] `, ...args);
};
export const debug = (...args): void => {
  log(...args);
};
export const error = (...args): void => {
  log(...args);
};
