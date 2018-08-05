const Webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
import { default as configServer } from './src/server/config/Config';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const buildPath = path.resolve(__dirname, 'build');

const PATHS = {
  app: path.join(__dirname, 'src/app'),
  images: path.join(__dirname, 'src/app/images'),
  build: path.join(__dirname, 'src/build'),
  worker: path.join(__dirname, 'src/app/js/worker')
};

module.exports = {
  watchOptions: {
    ignored: ['/node_modules/', '/harbourTown/', '/portUnion/'],
    poll: 1000
  },
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
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  // We have to manually add the Hot Replacement plugin when running
  // from Node
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'src', 'app', 'images'), to: 'images' }
    ]),
    new HardSourceWebpackPlugin({
      // Either an absolute path or relative to webpack's options.context.
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      // Either a string of object hash function given a webpack config.
      configHash(webpackConfig) {
          // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({ sort: false }).hash(webpackConfig);
      },
      // Either false, a string, an object, or a project hashing function.
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock']
      },
      // An object.
      info: {
          // 'none' or 'test'.
        mode: 'none',
          // 'debug', 'log', 'info', 'warn', or 'error'.
        level: 'debug'
      },
      // Clean up large, old caches automatically.
      cachePrune: {
          // Caches younger than `maxAge` are not considered for deletion. They must
          // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
          // All caches together must be larger than `sizeThreshold` before any
          // caches will be deleted. Together they must be at least this
          // (default: 50 MB) big in bytes.
        sizeThreshold: 50 * 1024 * 1024
      }
    })
  ]
};

// module.exports = config;
