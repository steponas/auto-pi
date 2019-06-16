/* eslint @typescript-eslint/explicit-function-return-type:0 */
import Relays, { RelayNum } from '../relays';

it('should generate correct values for all 6 relays', () => {
  for (let i = 1; i <= 6; i += 1) {
    expect(Relays.getAddr(i as RelayNum)).toEqual(0x20 + i - 1);
  }
});

it('should throw an error if relay number is too low', () => {
  // @ts-ignore
  const t = () => Relays.getAddr(0);
  expect(t).toThrow();
});

it('should throw an error if relay number is too high for a board', () => {
  const t = () => Relays.getAddr(7);
  expect(t).toThrow();
});

it('should map a low relay number to the first board', () => {
  const result = Relays.mapRelay(3);

  expect(result.boardAddr).toEqual(Relays.RELAY_1);
  expect(result.relayAddr).toEqual(Relays.getAddr(3));
  expect(result.relayNum).toEqual(3);
});

it('should map a high relay number to the first board', () => {
  // @ts-ignore
  const result = Relays.mapRelay(6 + 5);

  expect(result.boardAddr).toEqual(Relays.RELAY_2);
  expect(result.relayAddr).toEqual(Relays.getAddr(5));
  expect(result.relayNum).toEqual(5);
});
