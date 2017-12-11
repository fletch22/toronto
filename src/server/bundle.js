const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../../webpack.config.js');
import c from '../util/c';
import winston from 'winston';
import config from './config/config';

winston.info(`Environment is ${process.env.NODE_ENV}`);
const isDevelopment = process.env.NODE_ENV === 'development';

const clientBundler = function () {
  c.l('In bundler ...');

  // First we fire up Webpack an pass in the configuration we
  // created
  let bundleStart = null;
  const compiler = webpack(webpackConfig);

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin('compile', () => {
    c.l('Bundling...');
    bundleStart = Date.now();
  });

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin('done', () => {
    c.l(`Bundled in ${(Date.now() - bundleStart)} ms!`);
  });

  const bundler = new WebpackDevServer(compiler, {
    // We need to tell Webpack to serve our bundled application
    // from the build path. When proxying:
    // http://localhost:3000/build -> http://localhost:8080/build
    publicPath: '/build/',

    // Configure hot replacement
    hot: true,

    // The rest is terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true
    }
  });

  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  console.log('About to call bundler listen...');
  bundler.listen(config.getWebDevServerPort(), 'localhost', () => {
    console.log('Bundling project, please wait...');
  });
};

if (isDevelopment) {
  clientBundler();
}

module.exports = clientBundler;

