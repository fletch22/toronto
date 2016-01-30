'use strict';

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const webpack       = require('webpack-stream');
const named         = require("vinyl-named");
const webpackConfig   = require("./webpack.config.js")
const plumber = require('gulp-plumber');
const del = require('del');
const Server = require('karma').Server;
const path = require('path');

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
        .pipe(gulp.dest('build'));
        // .pipe(function(file) {
        //   return './build/' + file.base;
        // });
}

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


