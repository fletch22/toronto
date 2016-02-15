'use strict';

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const webpack       = require('webpack-stream');
const webpackOld      = require('webpack');
const named         = require("vinyl-named");
const webpackConfig   = require("./webpack.config.js");
const webpackConfigHotDeploy  = require("./webpack.hot.config.js");
const plumber = require('gulp-plumber');
const del = require('del');
const Server = require('karma').Server;
const path = require('path');
const WebpackDevServer = require("webpack-dev-server");


// ////////////////////////////////////////////////
// Test 
// ////////////////////////////////////////////////

const buildPath = path.resolve(__dirname, './build/');

gulp.task('clean', function() {

  var paths = del.sync([buildPath]);
  var message = '';
  if (paths.length > 0) {
    message = "\nDeleted the following: \n" + paths.join(',') + '\n';  
  } else {
    message = "\nNothing deleted. Nothing to delete?\n";
  }
  console.log(message); 

});

// __dirname + '/src/**/*.*'

gulp.task('js', function () {
    
    var files = [__dirname + '/test/js/**/*.js', __dirname + '/src/**/*.*'];

    return basicWorkflow(files);
});

function basicWorkflow(files) {

    return gulp.src(files)
        .on('error', handleError)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(function(file) {
          return file.base;
        }));
        ;
}

gulp.task("devrun", function(callback) {
    // Start a webpack-dev-server
    var compiler = webpackOld(webpackConfigHotDeploy);
    
    new WebpackDevServer(compiler, {
      // server and middleware options

      // We need to tell Webpack to serve our bundled application
      // from the build path. When proxying:
      // http://localhost:3000/build -> http://localhost:8080/build
      // publicPath: '/build/',
      contentBase: path.join(__dirname, 'build'),
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

    }).listen(8888, "localhost", function(err) {
        // if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // // Server listening
        // gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        // callback();
    });

});

gulp.task('dev', ['js']);

gulp.task('karma', function(done) {

  var Server = require('karma').Server;

  return new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
    }, done).start();
 
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}


