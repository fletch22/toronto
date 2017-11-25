const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
  entry: [
    'webpack/hot/poll?1000',
    './src/server/spec/index.js'
  ],
  watch: true,
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [nodeExternals({
    whitelist: ['webpack/hot/poll?1000']
  })],
  module: {
    rules: [{
      test: /\.js?$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new StartServerPlugin('./src/server/spec/index.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('server')
      }
    })
  ],
  output: {
    path: path.join(__dirname, './src/server/spec/'),
    filename: 'index.js'
  }
};
