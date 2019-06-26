import { createPool, Pool } from 'mysql';
import config from '../../config/db';

export default function (): Pool {
  const pool = createPool({
    connectionLimit: 2,
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.dbName,
  });

  return pool;
}
