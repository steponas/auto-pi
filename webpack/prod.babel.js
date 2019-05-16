/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/client/index.tsx'],
  mode: 'production',
  module: {
    rules: [
      { 
        test: /\.(t|j)sx?$/, 
        use: { loader: 'awesome-typescript-loader' },
        exclude: /node_modules/,
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
  },
};
