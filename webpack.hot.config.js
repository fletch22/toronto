const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  test: path.join(__dirname, 'test')
};

//var perf = '1.46,0.13,-0.47,-0.96,-0.58,-0.49,-0.89,-0.71,0.24,0.17,0.27,1.39,1.57,1.66,0.91,0.86,0.83,0.89,0.07,-0.37,-0.22,-0.25,-0.12,-0.13,0.03,0.03,0.70,0.72,0.69,0.73,0.62,0.68,0.31,0.31,0.67,0.35,0.33,0.53,0.47,0.24,0.33,0.59,0.64,0.61,0.65,0.77,0.71,0.49,0.72,0.57,0.64,0.90,1.14,1.21,1.00,0.92,0.93,0.93,1.21,0.67,0.89,0.90,0.92,0.94,0.94,0.70,0.68,0.67,0.58,0.61,0.68,0.71,0.69,0.72,0.76,0.71,0.74,0.72,0.70,0.64,0.65,0.70,0.72,0.69,0.60,0.65,0.63,0.87,0.81,0.87,0.78,0.78,0.68,0.71,0.64,0.71,0.73,0.72,0.73,0.70,0.71,0.71,0.69,0.66,0.71,0.78,0.85,0.77,0.76,0.71,0.56,0.61,0.69,0.67,0.64,0.65,0.66,0.71,0.66,0.64,0.41,0.39,0.41,0.41,0.45,0.39,0.46,0.49,0.53,0.53,0.36,0.43,0.44,0.56,0.57,';
//
//var arr = perf.split(',');
//
//console.log(arr.length);
//
//var newPerf = '\n';
//arr.forEach((test) => {
//  newPerf += (test + "\n");
//});
//
//console.log(newPerf);

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
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000' },
      {
        test: /\.js$/,
        exclude: /\.json$|(bower_components)/,
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
