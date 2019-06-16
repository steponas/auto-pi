/* eslint no-bitwise:0 */
/* eslint @typescript-eslint/explicit-function-return-type:0 */
import { turnAllOff } from '../index';
import Relays from '../relays';
import { bwToolWrite, bwToolReadRelayState } from '../bwtool';

jest.mock('../bwtool', () => ({
  bwToolWrite: jest.fn(),
  bwToolReadRelayState: jest.fn(),
}));
jest.mock('../timeouts', () => ({
  __esModule: true,
  default: {
    BEFORE_RELAY_CHECK: 0,
    AFTER_BAD_WRITE: 0,
  }
}));

const mockedBwToolWrite = bwToolWrite as any as jest.Mock<typeof bwToolWrite>;
const mockedBwToolReadRelayState = bwToolReadRelayState as any as jest.Mock<typeof bwToolReadRelayState>;

// Relays for board 1
const RELAY_2_ADDR = (1 << 1);
const RELAY_5_ADDR = (1 << 4);

beforeEach(() => jest.clearAllMocks());

it('should turn those relays off which are on currently', async () => {
  // In this scenario we say that three relays (2, 5, and 8) are on.
  // Also when turning the relays off, relay 5 will turn off only after the thrid retry.
  const relayCalls = {
    [Relays.RELAY_1]: [
      { addr: RELAY_2_ADDR, tries: 1 },
      { addr: RELAY_5_ADDR, tries: 3 },
    ],
    [Relays.RELAY_2]: [
      { addr: RELAY_2_ADDR, tries: 1 },
    ],
  };
  // @ts-ignore
  mockedBwToolReadRelayState.mockImplementation(async (board) => {
    const calls = relayCalls[board];
    let byte = 0;
    for (let i = 0; i < calls.length; i += 1) {
      const { addr, tries } = calls[i];
      if (tries > 0) {
        byte |= addr;
      }
    }

    return byte;
  });

  const writeParams = [];
  // @ts-ignore
  mockedBwToolWrite.mockImplementation(async (board, relay, bit) => {
    // @ts-ignore
    writeParams.push([board, relay, bit]);

    if (bit === '00') {
      // If the request is to turn off the board, decrease the counter
      const relayBit = 1 << (parseInt(relay, 10) - 20);
      const ref = relayCalls[board].find(({ addr }) => addr === relayBit);
      // @ts-ignore
      ref.tries -= 1;
    } else {
      throw new Error('Did not expect that a relay would be turned on');
    }
  });

  await turnAllOff();

  expect(writeParams).toEqual([
    [Relays.RELAY_1, (0x21).toString(16), '00'],
    [Relays.RELAY_1, (0x24).toString(16), '00'],
    [Relays.RELAY_1, (0x24).toString(16), '00'],
    [Relays.RELAY_1, (0x24).toString(16), '00'],
    [Relays.RELAY_2, (0x21).toString(16), '00'],
  ]);
});
