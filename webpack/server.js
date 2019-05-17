/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');
const common = require('./common');
const nodeExternals = require('webpack-node-externals');

module.exports = Object.assign({}, common, {
  entry: ['babel-polyfill', './src/server/index.ts'],
  mode: 'development',
  target: 'node',
  externals: [
    nodeExternals(),
  ],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist'),
  },
});
