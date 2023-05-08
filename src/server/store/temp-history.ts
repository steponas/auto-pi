import {Pool} from 'mysql';

interface TempHistoryResult {
  history: {
    temp: number;
    date: string;
  }[];
}
interface TempHistoryFn {
  (): Promise<TempHistoryResult>;
}

const QUERY = `
  select
    avg(temperature) as temp, 
    date_format(date, '%Y-%m-%dT%H:00:00Z') as date 
  FROM
    sensor_data 
  WHERE
    sensor_data.date >= date_sub(NOW(), INTERVAL 1 DAY) 
  GROUP BY 2 
  ORDER by 2 ASC
`;

export default function setup(connPool: Pool): TempHistoryFn {
  return (): Promise<TempHistoryResult> => new Promise((resolve, reject): void => {
    connPool.query(QUERY, (queryErr, rows): void => {
      if (queryErr) {
        reject(queryErr);
      } else {
        resolve({
          history: rows,
        });
      }
    });
  });
}
