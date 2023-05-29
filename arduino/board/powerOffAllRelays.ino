void powerOffAllRelays() {
  for (int pin = 0; pin < MAX_RELAY; pin++) {
    digitalWrite(pin, HIGH);
  }
}
