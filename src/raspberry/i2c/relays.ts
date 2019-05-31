const RELAY_START = 0x20;
const MAX_RELAYS = 12;

const RELAY_1 = '9b';
const RELAY_2 = '9c';

type RelayAddr = 0x20 | 0x21 | 0x22 | 0x23 | 0x24 | 0x25;
export type RelayNum = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface RelayData {
  boardAddr: '9b' | '9c';
  relayAddr: RelayAddr;
  relayNum: RelayNum;
}

const Relays = {
  RELAY_ON: 1,
  RELAY_OFF: 0,
  RELAY_1,
  RELAY_2,

  getAddr(relayNo: RelayNum): RelayAddr {
    if (relayNo >= 1 && relayNo <= 6) {
      return (RELAY_START + (relayNo - 1)) as RelayAddr;
    }
    throw new Error(`relayNo must be between 1 and 6, got ${relayNo}`);
  },

  // Map a relay number (1..12) to the board, board's relay number and relay's address
  mapRelay(relayNo: RelayNum): RelayData {
    if (relayNo < 1 || relayNo > MAX_RELAYS) {
      throw new Error(`Bad relay number "${relayNo}", should be between 1 and ${MAX_RELAYS}`);
    }
    const boardAddr = relayNo > 6 ? RELAY_2 : RELAY_1;
    const relayNum = (relayNo > 6 ? relayNo - 6 : relayNo) as RelayNum;
    const relayAddr = Relays.getAddr(relayNum);

    return { boardAddr, relayAddr, relayNum };
  },
};

export default Relays;
