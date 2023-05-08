/* eslint @typescript-eslint/no-var-requires:0 */
const WebpackAssetsManifest = require('webpack-assets-manifest');
const prodConfig = require('./prod.babel');

module.exports = Object.assign({}, prodConfig, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new WebpackAssetsManifest(),
  ],
});
