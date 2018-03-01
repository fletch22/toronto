const Webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
import { default as configServer } from './src/server/config/serverConfig';

const buildPath = path.resolve(__dirname, 'build');

const PATHS = {
  app: path.join(__dirname, 'src/app'),
  images: path.join(__dirname, 'src/app/images'),
  build: path.join(__dirname, 'src/build'),
  worker: path.join(__dirname, 'src/app/js/worker')
};

const config = {

  // Makes sure errors in console map to the correct file
  // and line number
  devtool: 'eval',
  node: {
    fs: 'empty'
  },
  entry: [
    'webpack/hot/dev-server',
    `webpack-dev-server/client?http://localhost:${configServer.getWebDevServerPort()}`,
    './src/app/index.js',
    'bootstrap-loader'
  ],
  output: {

    // We need to give Webpack a path. It does not actually need it,
    // because files are kept in memory in webpack-dev-server, but an
    // error will occur if nothing is specified. We use the buildPath
    // as that points to where the files will eventually be bundled
    // in production
    path: buildPath,
    filename: 'bundle.js',

    // Everything related to Webpack should go through a build path,
    // localhost:3000/build. That makes proxying easier to handle
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /\.json$|(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
        include: [PATHS.images]
      },
      {
        test: /\.(scss|css)$/,
        loader: `style-loader!css-loader!postcss-loader!sass-loader?includePaths[]=${PATHS.app}`
      },
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.scss'],
    modules: ['src', 'node_modules']
  },

  // We have to manually add the Hot Replacement plugin when running
  // from Node
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'src', 'app', 'images'), to: 'images' }
    ])
  ]
};

module.exports = config;
