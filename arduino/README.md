# Arduino Leonardo board code

For my hope setup, I've connected the Raspberry Pi to Arduino
Leonardo by USB. They communicate through the Serial protocol.

You can find the code in `board.ino` file.

## Serial comms

All serial commands start with a lower-case letter for the 
command, any bytes for state to set -- if the command expects it.

TL;DR: `${CMD:1}${BYTE:0-1}`

### Supported commands

* `S` - return the relay pin state. No data bytes. Responds with
list of bytes for each realy, F meaning OFF, T - ON.
Delimited by '\n'.
* `E${relayNo}` - Enable the `${relayNo}` relay.
* `D${relayNo}` - Disable the `${relayNo}` relay.
* `R` - resets all relays, turning them off.
