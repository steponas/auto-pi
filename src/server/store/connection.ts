import { createPool, Pool } from 'mysql';
import config from '../../config/db';

export default function (): Pool {
  const pool = createPool({
    connectionLimit: 2,
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.dbName,
  });

  return pool;
}
