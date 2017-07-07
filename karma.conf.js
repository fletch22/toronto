const webpackConfig = require('./webpack.hot.config.js');
/* eslint-disable no-var */
var pattern;

const TorontoKarmaConfig = function TorontoKarmaConfig(config) {
  const webpackConfigTest = webpackConfig;

  config.set({
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],
    // list of files / patterns to load in the browser
    files: [
      'node_modules/whatwg-fetch/fetch.js'
    ],
    // list of files to exclude
    exclude: [
    ],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-chai',
      'karma-sinon',
      'karma-webpack'
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
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
    browsers: ['Chrome'], // ['Chrome', 'PhantomJS', ],
    webpack: webpackConfigTest,
    webpackMiddleware: {
      noInfo: true
    },
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });

  if (process.env.EXECUTE_INTEGRATION_TESTS) {
    console.log('Running INTEGRATION tests only ...');
    pattern = 'app/js/__integrationTests__/test-context.js';
  } else {
    console.log('Running UNIT tests only ...');
    config.files.unshift({ pattern: 'node_modules/babel-polyfill/dist/polyfill.js', watched: false }); // Needed for Promise to be recognized. Note 'unshift'. Needs to be first element.
    pattern = 'app/js/__tests__/test-context.js';
  }

  config.files.push({ pattern, watched: false });

  /* eslint-disable no-param-reassign */
  config.preprocessors[pattern] = ['webpack'];
};


module.exports = TorontoKarmaConfig;

