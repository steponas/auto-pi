/* eslint @typescript-eslint/no-var-requires:0 */
const prodConfig = require('./prod');

module.exports = Object.assign({}, prodConfig, {
  mode: 'development',
  devtool: 'source-map',
});
