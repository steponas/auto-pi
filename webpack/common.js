/* eslint @typescript-eslint/no-var-requires:0 */
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsConfigPathsPlugin({ configFileName: `${__dirname}/../tsconfig.json` }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/, 
        use: { loader: 'awesome-typescript-loader' },
        exclude: /node_modules/,
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};
