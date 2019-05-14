const bwtool = require('../bwtool');
const { gpioLock: mockGpioLock } = require('../../../common/gpio');

// eslint-disable-next-line no-var
var mockExec;
jest.mock('util', () => {
  mockExec = jest.fn();
  return {
    promisify: () => mockExec,
  };
});
jest.mock('../../../common/log', () => ({
  log: () => {},
  debug: () => {},
  error: () => {},
}));

jest.mock('../../../common/gpio', () => ({
  gpioLock: jest.fn(),
}));

const bwtoolPrefix = 'bw_tool -I -D /dev/i2c-1 -a';

beforeEach(() => {
  jest.clearAllMocks();
  mockGpioLock.mockImplementation(() => Promise.resolve(() => Promise.resolve()));
});

it('should pass correct commands to shell', async () => {
  await bwtool.bwToolWrite('$board$', '#cmd#', '!bit!');
  expect(mockExec).toHaveBeenCalledWith(`${bwtoolPrefix} $board$ -W #cmd#:!bit!:b`);
});

it('should await gpio lock before proceeding', async () => {
  const mockRelease = jest.fn();
  let allowGPIO;
  mockGpioLock.mockImplementation(() => new Promise((resolve) => {
    allowGPIO = resolve;
  }));
  const writePromise = bwtool.bwToolWrite('board', 'cmd', 'bit');

  // It should not have been called yet - lock not released.
  expect(mockExec).not.toHaveBeenCalled();

  allowGPIO(mockRelease);

  await writePromise;

  expect(mockExec).toHaveBeenCalledTimes(1);
  expect(mockRelease).toHaveBeenCalledTimes(1);
});

it('should correctly read all relay state', async () => {
  mockExec.mockImplementation(() => Promise.resolve({ stdout: '10' }));
  const result = await bwtool.bwToolReadRelayState('Board1');

  expect(mockExec).toHaveBeenCalledWith(`${bwtoolPrefix} Board1 -R 10:b`);
  expect(result).toEqual(0x10);
});
