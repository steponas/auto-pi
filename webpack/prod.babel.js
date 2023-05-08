/* eslint @typescript-eslint/no-var-requires:0 */
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const common = require('./common');
const zlib = require("zlib");

module.exports = Object.assign({}, common, {
  entry: {
    client: ['babel-polyfill', './src/client/index.tsx'],
  },
  mode: 'production',
  output: {
    filename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, '../dist/client'),
    publicPath: '/',
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path][base].br',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
    new WebpackAssetsManifest(),
  ],
});
