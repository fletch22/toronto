import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'nodemon';
import 'babel-core/register';
import config from './src/server/config/config';

const ouputFolder = config.getTestOuputFolderName();

gulp.task('es6', () => {
  gulp.src(['./src/**/*.js', '!./src/app/**/*.*'])
    .pipe(babel({
      ignore: 'gulpfile.babel.js'
    }))
    .pipe(gulp.dest(`./${ouputFolder}`));
});

gulp.task('copy', () => {
  gulp.src(['./src/**/*.json', '!./src/app/**/*.*'])
    .pipe(gulp.dest(`./${ouputFolder}`));
});

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.*', '!./src/app/**/*.*'], ['restart']);
});

// start our server and listen for changes
gulp.task('test', () => {
  nodemon({
    // The script to run the app.
    script: `./${ouputFolder}/server/spec/index.js`,
    // This listens to changes in any of these files/routes and restarts the application
    watch: [`./${ouputFolder}/**/*.*`],
    ext: 'js'
  })
  .on('restart', () => {
    console.log('Restarted...');
  });
});

gulp.task('restart', ['es6', 'copy', 'test']);

gulp.task('default', ['es6', 'copy', 'test', 'watch']);
