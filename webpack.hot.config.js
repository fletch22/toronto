const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  test: path.join(__dirname, 'test')
};

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './app')
];

// const TARGET = process.env.npm_lifecycle_event;

const common = {
  // Entry accepts a path or an object of entries.
  // The build chapter contains an example of the latter.
  entry: [PATHS.app, 'bootstrap-loader'],
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      // {
      //   // Test expects a RegExp! Note the slashes!
      //   test: /\.css$/,
      //   loaders: ['style', 'css'],
      //   // Include accepts either a path or an array of paths.
      //   include: PATHS.app
      // },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
      {
        test: /\.js$/,
        exclude: /\.json$|(bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!')),
      //   include: PATHS.app
      // }
      {
          test: /\.scss$/,
          loader: 'style-loader!css-loader!postcss-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, './app'),
          include: PATHS.app
      },
      { 
        test: /bootstrap-sass\/assets\/javascripts\//, 
        loader: 'imports?jQuery=jquery' 
      }
    ]
  }
};

// Default configuration
// if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize.
      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      new webpack.HotModuleReplacementPlugin()
    ],
    postcss: [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ],
    resolve: {
      extensions: ['', '.js', '.scss'],
      modulesDirectories: ['app', 'node_modules']
    }
  }
);
// }

// if(TARGET === 'build') {
//   module.exports = merge(common, {});
// }

// console.log('Lifecycle event: ' + TARGET);
