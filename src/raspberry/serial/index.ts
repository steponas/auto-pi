import { SerialPort } from 'serialport';
import { DelimiterParser } from '@serialport/parser-delimiter';

enum COMMANDS {
  ENABLE_RELAY = 'E',
  DISABLE_RELAY = 'D',
  GET_STATE = 'S',
  RESET_RELAYS = 'R',
}
enum RELAY_STATES {
  ON = 'T',
  OFF = 'F'
}

const MAX_RELAY = 16;
const STATE_DELIMITER = '\n';

const debug = (str) => {
  // Comment out return to enable debug logging
  return;
  console.log(str);
}

/**
 * The Relay State handling class.
 */
export class SerialRelay {
  serialport: SerialPort;

  constructor() {
    // TODO should disconnects be handled separatelly? Eg by recreating the port.
    this.serialport = new SerialPort({
      // Your serial port might be different
      path: '/dev/ttyACM0',
      baudRate: 9600,
    });

    this.serialport.on('error', (err) => {
      console.error(`Error during Serial communication: ${err.message}`);
    });
  }

  async _writeWithDrain(...chunks: (string | Buffer)[]) {
    return new Promise<void>((resolve, reject) => {
      for (let c of chunks) {
        this.serialport.write(c);
        debug(`wrote ${c}`);
      }
      this.serialport.drain((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
          debug(`Drained cmd`);
        }
      });
    });
  }

  async toggleRelay(relayNum: number, state: boolean) {
    if (relayNum < 0 || relayNum >= MAX_RELAY) {
      throw new Error(`Invalid relay number: ${relayNum}. Should be 0 < $NUM < ${MAX_RELAY}`);
    }
    const cmd = state ? COMMANDS.ENABLE_RELAY : COMMANDS.DISABLE_RELAY;
    await this._writeWithDrain(
      cmd,
      // Write the relay number as a byte, through Buffer.
      Buffer.from([relayNum])
    );
  }

  async getState(): Promise<boolean[]> {
    const parser = new DelimiterParser({
      delimiter: STATE_DELIMITER,
    });
    this.serialport.pipe(parser);

    // Cleanup after the message is received
    const cleanup = () =>
      this.serialport.unpipe(parser);

    const p = new Promise<boolean[]>(async (resolve, reject) => {
      parser.on('data', (relayData: Buffer) => {
        const strData = relayData.toString();
        debug(`got relayData: ${strData}`);

        const result: boolean[] = [];

        const len = relayData.length;
        for (let i = 0; i < len; i++) {
          debug(`got relayData[${i}] == ${strData[i]} eq? ${strData[i] === RELAY_STATES.ON}`);
          result.push(strData[i] === RELAY_STATES.ON);
        }
        resolve(result);
      });
      parser.on('error', (err) => {
        reject(new Error('Got error during relay state parsing'));
      });

      try {
        // Write the command, result will be parsed async.
        await this._writeWithDrain(COMMANDS.GET_STATE);
      } catch(err) {
        reject(new Error('Got error when writing relay state command'));
      }
    });

    // Cleanup after the promise is settled.
    p.finally(cleanup);

    return p;
  }

  async turnOffAllRelays() {
    this._writeWithDrain(COMMANDS.RESET_RELAYS);
  }
}
