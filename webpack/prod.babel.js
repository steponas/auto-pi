/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');
const common = require('./common');

module.exports = Object.assign({}, common, {
  entry: ['babel-polyfill', './src/client/index.tsx'],
  mode: 'production',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
});
