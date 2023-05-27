void returnPinState() {
  for (int pin = 0; pin < MAX_RELAY; pin++) {
    int state = digitalRead(pin);
    // Send T if pin is LOW (relay enabled), F otherwise.
    Serial.write(state == 0 ? 'T' : 'F');
  }
  Serial.write('\n');
}
