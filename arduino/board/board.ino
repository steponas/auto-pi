/**
 * This file is the main entry file.
 * It defines all constants, the setup and main arduino loop.
 *
 * Other functions are defined in their representative .ino files, e.g. `setPin.ino`.
 */

// Board config for Arduino Leonardo
#define MAX_RELAY 16
#define DEBUG false

void setup() {
  Serial.begin(9600);
  for (int pin = 0; pin < MAX_RELAY; pin++) {
    pinMode(pin, OUTPUT);
  }

  powerOffAllRelays();

  while (!Serial) {
    ;  // wait for serial port to connect. Needed for native USB
  }
}

void loop() {
  if (Serial.available() > 0) {

    byte pinBuffer[1];
    char cmd = char(Serial.read());

    #if DEBUG
      Serial.print("Got CMD: ");
      Serial.print(cmd);
      Serial.write('\n');
    #endif

    switch (cmd) {
      case 'S':
        returnPinState();
        #if DEBUG
          Serial.print("S command completed\n");
        #endif
        break;
      case 'E':
        Serial.readBytes(pinBuffer, 1);
        setPin(int(pinBuffer[0]), LOW);
        #if DEBUG
          Serial.print("E command completed\n");
        #endif
        break;
      case 'D':
        Serial.readBytes(pinBuffer, 1);
        setPin(int(pinBuffer[0]), HIGH);
        #if DEBUG
          Serial.print("D command completed\n");
        #endif
        break;
      case 'R':
        powerOffAllRelays();
        #if DEBUG
          Serial.print("R command completed\n");
        #endif
        break;
      default:
        // unknown command, do nothing
        break;
    }
  }
}
