// Shared state for the whole app
export const KEY_TEMP_SENSOR = 'temp-data';

export const state = new Map();
// Some initial data
state.set(KEY_TEMP_SENSOR, {
  temp: 0,
  humidity: 0,
  time: Date.now(),
});
