var watchify      = require('watchify');
var browserify    = require('browserify');
var gulp          = require('gulp');
var source        = require('vinyl-source-stream');
var buffer        = require('vinyl-buffer');
var gutil         = require('gulp-util');
var babelify      = require('babelify');
var uglify        = require('gulp-uglify');
var sourcemaps    = require('gulp-sourcemaps');
var assign        = require('lodash.assign');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var react         = require('react');
var reactDOM      = require('react-dom');
var mocha         = require('gulp-mocha');
var babel         = require('gulp-babel');
var jquery        = require('jquery');

// ////////////////////////////////////////////////
// Javascript Browserify, Watchify, Babel, React
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// ////////////////////////////////////////////////

function bundle() {

  // add custom browserify options here
  var customOpts = {
    entries: ['./src/js/app.js'],
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  var b = watchify(browserify(opts)); 

  // add transformations here
  b.transform("babelify", {presets: ["es2015", "react"]});

  gulp.task('js', bundle); // so you can run `gulp js` to build the file
  b.on('update', bundle); // on any dep update, runs the bundler
  b.on('log', gutil.log); // output build logs to terminal

  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, gutil.colors.red(
       '\n\n*********************************** \n' +
      'BROWSERIFY ERROR:' +
      '\n*********************************** \n\n'
      )))
    .pipe(source('main.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(uglify())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('../maps')) // writes .map file
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.reload({stream:true}));
}

// ////////////////////////////////////////////////
// Browser-Sync Tasks
// ////////////////////////////////////////////////
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "./public/"
        }
    });
});

// ////////////////////////////////////////////////
// HTML Tasks
// ////////////////////////////////////////////////
gulp.task('html', function() {
  return gulp.src('public/**/*.html')
    .pipe(browserSync.reload({stream:true}));
});

// ////////////////////////////////////////////////
// Styles Tasks
// ///////////////////////////////////////////////
gulp.task('styles', function() {
  gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}))
      // .on('error', errorlog)
      .on('error', gutil.log.bind(gutil, gutil.colors.red(
         '\n\n*********************************** \n' +
        'SASS ERROR:' +
        '\n*********************************** \n\n'
        )))
      .pipe(autoprefixer({
              browsers: ['last 3 versions'],
              cascade: false
          })) 
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.reload({stream:true}));
});

// ////////////////////////////////////////////////
// Composite Default Task
// ////////////////////////////////////////////////
gulp.task('default', ['js', 'styles', 'browserSync', 'watch']);

// ////////////////////////////////////////////////
// Test 
// ////////////////////////////////////////////////
gulp.task('mocha', function () {
    var customOpts = {
      entries: ['test/first_test.js'],
      debug: true
    };
    var opts = assign({}, watchify.args, customOpts);
    var bundler = watchify(browserify(opts)); 

    bundler.transform(babelify, {presets: ["es2015", "react"]});

    bundler.bundle()
        .on('error', handleError)
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
        .pipe(mocha({reporter: 'nyan', require: ['jquery']}))
        .on('error', handleError);

    return bundle;
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// ////////////////////////////////////////////////
// Composite Test
// ////////////////////////////////////////////////
gulp.task('mochaw', ['mocha', 'watch-mocha']);

// ////////////////////////////////////////////////
// Watch Tasks
// ////////////////////////////////////////////////
gulp.task('watch', function() {
  gulp.watch('public/**/*.html', ['html']);
  gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['test/**/*.js'], ['mocha']);
});





