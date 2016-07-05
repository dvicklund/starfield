var gulp = require('gulp')
var clean = require('gulp-clean')
var webpack = require('webpack-stream')
var sass = require('gulp-sass')
var minifyCss = require('gulp-cssnano')
var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer')
var protractor = require('gulp-protractor').protractor
var mocha = require('gulp-mocha')

var paths = {
  css: ['app/**/*.scss', 'app/**/*.sass', 'app/*.css'],
  html: ['app/**/*.html'],
  js: ['app/**/*.js'],
  static: ['img/*', 'vendor/*'],
  testBack: ['test/*Test.js'],
  testFront: ['test/specIndex.js']
}

gulp.task('build:css', function() {
  gulp.src('app/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/'))

  gulp.src('app/style.css')
    .pipe(gulp.dest('build/'))
})

gulp.task('build:html', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('build/'))
})

gulp.task('build:js', function() {
  gulp.src('app/js/*.js').pipe(gulp.dest('build/'))

  // return gulp.src('app/js/entry.js')
  // .pipe(webpack({
  //   output: {
  //     filename: 'bundle.js'
  //   }
  // }))
  // .pipe(gulp.dest('build/'))
})

gulp.task('build:static', function() {
  gulp.src('img/*')
  .pipe(gulp.dest('build/img'))

  gulp.src('vendor/*')
  .pipe(gulp.dest('build/vendor'))
})

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
        .pipe(clean({force: true}))
})

gulp.task('test:back', function() {
  return gulp.src(paths.testBack, {read: false})
        .pipe(mocha({reporter: 'nyan'}))
})

gulp.task('test:front', function() {
  gulp.src(paths.testFront).pipe(protractor({
    configFile: 'protractor.config.js'
  }))
  .on('error', function(e) {throw e})
})

gulp.task('watch:css', function() {
	gulp.watch(paths.css, ['build:css'])
})

gulp.task('watch:html', function() {
	gulp.watch(paths.html, ['build:html'])
})

gulp.task('watch:js', function() {
	gulp.watch(paths.js, ['build:js'])
})

gulp.task('watch:static', function() {
  gulp.watch(paths.static, ['build:static'])
})

gulp.task('build:all', ['build:css', 'build:html', 'build:js', 'build:static'])
gulp.task('test:all', ['test:back', 'test:front'])
gulp.task('watch:all', ['watch:css', 'watch:html', 'watch:js'])
gulp.task('default', ['build:all', 'watch:all'])
