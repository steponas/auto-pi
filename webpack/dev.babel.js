/* eslint @typescript-eslint/no-var-requires:0 */
const prodConfig = require('./prod.babel');

module.exports = Object.assign({}, prodConfig, {
  mode: 'development',
  devtool: 'source-map',
});
