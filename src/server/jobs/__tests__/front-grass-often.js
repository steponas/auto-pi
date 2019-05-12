const setupCron = require('../front-grass-often');
const mockedi2c = require('../../../raspberry/i2c');
const mockedHelpers = require('../../../common/helpers');
const { FRONT_LAWN } = require('../../../config/relay-names');

jest.mock('../../../raspberry/i2c', () => ({
  toggleRelay: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../../common/helpers', () => ({
  waitFor: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../../common/log', () => ({
  log: () => {},
}));

it('should run start the sprinkler, wait, and turn if off', async () => {
  let name;
  let runFn;
  let startNow;
  setupCron((pName, cron, pRunFn, pStartNow) => {
    name = pName;
    runFn = pRunFn;
    startNow = pStartNow;
  });

  await runFn();

  expect(name).toEqual('FrontLawnOften');

  // Relay was turned on and off
  expect(mockedi2c.toggleRelay).toHaveBeenCalledTimes(2);
  expect(mockedi2c.toggleRelay.mock.calls[0]).toEqual([FRONT_LAWN, true]);
  expect(mockedi2c.toggleRelay.mock.calls[1]).toEqual([FRONT_LAWN, false]);

  expect(mockedHelpers.waitFor).toHaveBeenCalledTimes(1);
  expect(mockedHelpers.waitFor.mock.calls[0]).toEqual([10 * 60 * 1000]);

  // Should not be started right away
  expect(startNow).toBe(false);
});
