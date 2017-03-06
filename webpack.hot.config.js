const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'app/'),
  images: path.join(__dirname, 'app/images'),
  build: path.join(__dirname, 'build'),
  worker: path.join(__dirname, 'app/js/worker')
};

const common = {
  // Entry accepts a path or an object of entries.
  entry: {
    bundle: ['./app/index.js', 'bootstrap-loader']
  },
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.ico$/,
        loader: 'file?name=[name].[ext]',
        include: PATHS.images
      },
      {
        test: /\.js$/,
        exclude: /\.json$|(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
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
  }
};

module.exports = merge(common, {
  devtool: 'eval',
  devServer: {
    contentBase: PATHS.build,
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
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      { from: 'app/images', to: 'images' }
    ])
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['app', 'node_modules'],
    alias: {
      c: path.resolve(__dirname, 'app', 'js', 'util', 'c.js')
    }
  }
});
