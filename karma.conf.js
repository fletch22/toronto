var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};


const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './app')
];

console.log(path.resolve(__dirname, './app'));


module.exports = function(config) {
  config.set({
 
    basePath: '',
 
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
 
 
    // list of files / patterns to load in the browser
    files: [
      // 'test/scripts/specs/app.spec.js' -- Original
      'app/specs/test_index.js'
    ],
 
    // list of files to exclude
    exclude: [
    ],
 
    plugins: [
        'karma-chrome-launcher',
        'karma-jasmine',
        'karma-webpack'
    ],
 
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/specs/test_index.js': [ 'webpack', 'sourcemap' ],
        'app/css/modules/header.scss': [ 'webpack', 'sourcemap' ]
    },
 
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],
 
    // web server port
    port: 9876,
 
 
    // enable / disable colors in the output (reporters and logs)
    colors: true,
 
 
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,
 
 
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
 
 
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],
 
    webpack: {
      resolve: {
        extensions: ['', '.js', '.scss'],
        modulesDirectories: ['app', 'node_modules']
      },
      entry: ['./app/specs/test_index.js', './app/css/modules.header.scss'],
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['react', 'es2015']
            }
          },
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!')),
            include: PATHS.app
          }
        ],
      },
      plugins: [
        new ExtractTextPlugin('[name].css')
      ],
    },
    webpackMiddleware: {
      noInfo: true,
    },
 
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}