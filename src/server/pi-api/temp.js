const { success } = require('../common/response');
const { state, KEY_TEMP_SENSOR } = require('../common/state');
/**
 * Get the current temperature.
 */
module.exports = async function getTemp(req, res) {
  const { temp, humidity } = state.get(KEY_TEMP_SENSOR);
  res.json(
    success({ temp, humidity }),
  );
};
