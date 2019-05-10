const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../../dist'),
    publicPath: '/',
  },
};
