/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');
const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const common = require('./common');

module.exports = Object.assign({}, common, {
  entry: {
    client: ['babel-polyfill', './src/client/index.tsx'],
  },
  mode: 'production',
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: '/',
  },
  plugins: [
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.js$|\.css$|\.html$/,
    }),
    new CompressionPlugin(),
    new WebpackAssetsManifest(),
  ],
});
