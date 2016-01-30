const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
];

module.exports = {
  watch: true,
  debug: true,
  module: {
    loaders: [
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
	    	loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
		}
    ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, './build'),
    publicPath: '/build'
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: ['src', 'node_modules']
  }
};
