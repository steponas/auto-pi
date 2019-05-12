const setupCron = require('../grass-sprinklers');
const mockedi2c = require('../../../raspberry/i2c');
const mockedHelpers = require('../../../common/helpers');
const {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} = require('../../../config/relay-names');

jest.mock('../../../raspberry/i2c', () => ({
  toggleRelay: jest.fn(),
}));
jest.mock('../../../common/helpers', () => ({
  waitFor: jest.fn(),
}));
jest.mock('../../../common/log', () => ({
  log: () => {},
}));

it('should run start the sprinkler, wait, and turn if off', async () => {
  const calls = [];
  mockedi2c.toggleRelay.mockImplementation((relay, isOn) => calls.push(['relay', relay, isOn]));
  mockedHelpers.waitFor.mockImplementation(time => calls.push(['wait', time]));

  let name;
  let runFn;
  setupCron((pName, cron, pRunFn) => {
    name = pName;
    runFn = pRunFn;
  });

  await runFn();

  expect(name).toEqual('Grass Sprinklers');

  // We have a plan set up, let us confirm that the execution is the same.

  expect(calls).toEqual([
    ['relay', FRONT_LAWN, true],
    ['wait', 10 * 60 * 1000],
    ['relay', FRONT_LAWN, false],

    ['relay', BACK_LAWN_1, true],
    ['wait', 10 * 60 * 1000],
    ['relay', BACK_LAWN_1, false],

    ['relay', BACK_LAWN_2, true],
    ['wait', 10 * 60 * 1000],
    ['relay', BACK_LAWN_2, false],

    ['relay', SLOPE, true],
    ['wait', 3 * 60 * 60 * 1000],
    ['relay', SLOPE, false],
  ]);
});
