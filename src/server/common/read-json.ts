import {readFileSync} from 'fs';
export const readJsonSync = (path: string): any => {
  const strData = readFileSync(path, { encoding: 'utf-8' });
  return JSON.parse(strData);
};
