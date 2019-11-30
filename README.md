# auto-pi

This is a simple Raspberry-Pi home-automation software built for my own use.

It is in no way a "final product", one could take this as a simple reference to what a DIY rPi automation could look like. :-)

It supports a tiny amount of features:
* toggling relays;
* cron tasks (for automating the relays, e.g. for lawn sprinklers or Xmas lights);
* temperature measurement and storing to a remote mysql DB;
* a minimalistic web-based UI for mobile phones to toggle the relays by hand.

## Building and running

First, create a `src/config/db.ts` with MySQL DB credentials.
You can look at `db-example.ts` for the structure.

The DB must be prepopulated with structure from `src/server/data/db.sql`.

Then it should be as simple as running
```bash
yarn install
yarn start # or yarn build && yarn server
```
on your rPi. Of course you need to have the relays connected, etc.
And possibly the code needs to be adjusted for your needs.

## Screenshot of UI

Note: the number at the top show the current temperature, in Celsius.

![UI screenshot](/static/ui-screenshot.png?raw=true "UI screenshot")
