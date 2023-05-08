/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      server: path.resolve(__dirname, '../src/server'),
      client: path.resolve(__dirname, '../src/client'),
      common: path.resolve(__dirname, '../src/common'),
      raspberry: path.resolve(__dirname, '../src/raspberry'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};
