const webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = function TorontoKarmaConfig(config) {
  config.set({
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'], //['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      { pattern: 'test-context.js', watched: false }
    ],
    // list of files to exclude
    exclude: [
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-webpack'
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test-context.js': ['webpack'],
      'app/css/modules/header.scss': ['webpack']
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
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome'],
    webpack: {
      watch: true,
      resolve: {
        extensions: ['', '.js', '.scss'],
        modulesDirectories: ['app', 'node_modules']
      },
      entry: ['./app/css/modules/header.scss', 'bootstrap-loader'],
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
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
            exclude: /node_modules/,
            loader: `style-loader!css-loader!postcss-loader!sass-loader?includePaths[]=${path.resolve(__dirname, './app')}`,
            include: PATHS.app
          },
          {
            test: /bootstrap-sass\/assets\/javascripts\//,
            exclude: /node_modules/,
            loader: 'imports?jQuery=jquery'
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin('[name].css')
      ]
    },
    webpackMiddleware: {
      noInfo: true
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
