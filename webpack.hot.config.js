const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const PATHS = {
  build: path.join(__dirname, 'build'),
  worker: path.join(__dirname, 'app/js/worker')
};

const common = {
  // Entry accepts a path or an object of entries.
  entry: {
    bundle: ['./app/index.js', 'bootstrap-loader']
  },
  output: {
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
      {
        test: /\.js$/,
        exclude: /\.json$|(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: `style-loader!css-loader!postcss-loader!sass-loader?includePaths[]=${path.resolve(__dirname, './app')}`,
        include: PATHS.app
      },
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
      }
    ]
  }
};

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
    port: 8888 // process.env.PORT
  },
  plugins: [
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
});
