void setPin(int pin, int value) {
  if (pin < 0 || pin >= MAX_RELAY) {
    // Invalid pin value
    #if DEBUG
      Serial.print("setPin::invalid pin value: ");
      Serial.print(pin);
      Serial.write("\n");
    #endif
    return;
  }
  #if DEBUG
    Serial.print("Setting pin ");
    Serial.print(pin);
    Serial.print(value == 0 ? " off" : " on");
    Serial.write("\n");
  #endif
  digitalWrite(pin, value);
}
