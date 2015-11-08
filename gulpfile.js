// Regular NPM dependencies
var argv = require('minimist')(process.argv.slice(2));
var browserSync = require('browser-sync');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var source = require('vinyl-source-stream');

// Gulp dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();


var CONFIG = {
  is_release: !!argv.release
};

var reload = browserSync.reload;


gulp.task('clean', function () {
  del.sync(['./dist']);
});


gulp.task('build-js', function () {
  var b = browserify({
    entries: ['./src/js/app.js'],
    debug: false
  });
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.ngAnnotate())
    .pipe($.if(CONFIG.is_release, $.uglify()))
    .pipe(gulp.dest('./dist/js'));
});


gulp.task('sass', function () {
  var output_style = CONFIG.is_release ? 'compressed' : 'expanded';

  return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass({
      outputStyle: output_style
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: [
    	'last 2 versions'
    ]}))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('build-html', ['build-js', 'sass'], function () {
  var target = gulp.src('./src/index.html');
  var sources = gulp.src([
    './dist/js/**/*.js',
    './dist/css/**/*.css'
  ], {read: false});

  return target
    .pipe($.inject(sources, {ignorePath: '/dist/'}))
    .pipe($.if(CONFIG.is_release, $.minifyHtml()))
    .pipe(gulp.dest('./dist'));
});


gulp.task('static', function () {
  gulp.src('./src/static/**/*')
    .pipe(gulp.dest('./dist'));
});


gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js', './tests/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});


gulp.task('build', ['static', 'build-html']);


gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'xmas',
    server: 'dist',
    baseDir: 'dist'
  });

  gulp.watch(['./src/**/*', './gulpfile.js'], ['build', reload]);
});


gulp.task('default', ['build']);
