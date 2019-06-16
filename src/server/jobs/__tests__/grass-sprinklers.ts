/* eslint @typescript-eslint/explicit-function-return-type:0 */
import setupCron from '../grass-sprinklers';
import { toggleRelay } from '../../../raspberry/i2c';
import { waitFor } from '../../../common/helpers';
import {
  FRONT_LAWN, BACK_LAWN_1, BACK_LAWN_2, SLOPE,
} from '../../../config/relay-names';

jest.mock('../../../raspberry/i2c', () => ({
  toggleRelay: jest.fn(),
}));
jest.mock('../../../common/helpers', () => ({
  waitFor: jest.fn(),
}));
jest.mock('../../../common/log', () => ({
  log: () => {},
}));

const mockToggleRelay = toggleRelay as any as jest.Mock<typeof toggleRelay>;
const mockedWaitFor = waitFor as any as jest.Mock<typeof waitFor>;

it('should run start the sprinkler, wait, and turn if off', async () => {
  const calls: any[] = [];
  // @ts-ignore
  mockToggleRelay.mockImplementation((relay, isOn) => calls.push(['relay', relay, isOn]));
  // @ts-ignore
  mockedWaitFor.mockImplementation(time => calls.push(['wait', time]));

  let name;
  let runFn;
  let startNow;
  setupCron((pName, cron, pRunFn, pStartNow) => {
    name = pName;
    runFn = pRunFn;
    startNow = pStartNow;
  });

  await runFn();

  // Should not be started right away
  expect(startNow).toBe(false);

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
