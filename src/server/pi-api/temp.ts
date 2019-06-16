import { success } from 'server/common/response';
import { state, KEY_TEMP_SENSOR } from 'server/common/state';
/**
 * Get the current temperature.
 */
export default async function getTemp(req, res): Promise<void> {
  const { temp, humidity } = state.get(KEY_TEMP_SENSOR);
  res.json(
    success({ temp, humidity }),
  );
};
