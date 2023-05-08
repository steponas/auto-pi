import { success } from 'server/common/response';
import {getTempHistory} from "server/store";
/**
 * Get the current temperature.
 */
export async function handleTempHistory(req, res): Promise<void> {
  try {
    const data = await getTempHistory();
    res.json(
      success(data),
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
