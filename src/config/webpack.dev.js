/* eslint import/no-extraneous-dependencies:0 */
const webpack = require('webpack');
const prodConfig = require('./webpack.prod.js');

module.exports = Object.assign({}, prodConfig, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    hotOnly: true,
    publicPath: 'http://localhost:3000/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
