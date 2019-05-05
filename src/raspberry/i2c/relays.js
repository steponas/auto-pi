const RELAY_START = 0x20;
const MAX_RELAYS = 12;

const RELAY_1 = '9b';
const RELAY_2 = '9c';

const Relays = {
  RELAY_ON: 1,
  RELAY_OFF: 0,
  RELAY_1,
  RELAY_2,

  getAddr(relayNo) {
    if (relayNo >= 1 && relayNo <= 6) {
      return RELAY_START + (relayNo - 1);
    }
    throw new Error(`relayNo must be between 1 and 6, got ${relayNo}`);
  },

  mapRelay(relayNo) {
    if (relayNo < 1 || relayNo > MAX_RELAYS) {
      throw new Error(`Bad relay number "${relayNo}", should be between 1 and ${MAX_RELAYS}`);
    }
    const boardAddr = relayNo > 6 ? RELAY_2 : RELAY_1;
    const relayNum = relayNo > 6 ? relayNo - 6 : relayNo;
    const relayAddr = Relays.getAddr(relayNum);

    return { boardAddr, relayAddr, relayNum };
  },
};

module.exports = Relays;
