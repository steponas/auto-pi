/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');
const common = require('./common');
const nodeExternals = require('webpack-node-externals');
const fs = require('fs');

const getCliEntries = () => {
  const cliRoot = './src/cli';
  const paths = fs.readdirSync(
    path.resolve(__dirname, `.${cliRoot}`)
  );

  return paths.reduce(
    (map, path) => {
      const [pathName] = path.split('.');
      map[`cli-${pathName}`] = `${cliRoot}/${path}`;
      return map;
    },
    {}
  );
};

module.exports = Object.assign({}, common, {
  entry: {
    ...getCliEntries(),
    server: ['babel-polyfill', './src/server/index.ts'],
  },
  mode: 'development',
  target: 'node',
  externals: [
    nodeExternals(),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  node: {
    __dirname: false,
  }
});
