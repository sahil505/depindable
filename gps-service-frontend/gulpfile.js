var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    uglifyCss = require('gulp-uglifycss'),
    compass = require('gulp-compass'),
    del = require('del'),
    runSequence = require('run-sequence');

gulp.task('clean', function() {
  return del([
    'dist/**/*'
  ]);
});
gulp.task('build-bower-lib', function() {
  return gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
})



gulp.task('build-bower-lib', function() {
  return gulp.src([
                  'bower_components/angular/angular.min.js',
                  'bower_components/angular-material/angular-material.min.js',
                  'bower_components/angular-sanitize/angular-sanitize.min.js',
                  'bower_components/angular-messages/angular-messages.min.js',
                  'bower_components/angular-aria/angular-aria.min.js',
                  'bower_components/angular-route/angular-route.min.js',
                  'bower_components/angular-animate/angular-animate.min.js'])
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('dist/js'));
})

gulp.task('build-node-lib', function() {
  return gulp.src('node_modules/chartjs-plugin-zoom/*')
    .pipe(gulp.dest('dist/node_modules/chartjs-plugin-zoom'));
})
gulp.task('build-root', function() {
  return gulp.src(['index.html','main.js','themify-icons.css'])
    .pipe(gulp.dest('dist/'));
});
gulp.task('build-images', function() {
  return gulp.src(['images/**'])
    .pipe(gulp.dest('dist/images'));
});
gulp.task('build-fonts', function () {
  return gulp.src('fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build-templates', function () {
  return gulp.src('templates/*.html')
    .pipe(gulp.dest('dist/templates/'));
});
gulp.task('build-sourcejs', function() {
  return gulp.src(['main.js', 'js/*.js'])
    .pipe(concat('psylab.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('build-customcss', function() {
  return gulp.src([
      'bower_components/angular-material/angular-material.min.css',
      'css/*.css'])
    .pipe(concat('psylab.css'))
    .pipe(gulp.dest('dist/css'));
});
gulp.task('compass-build', function() {
  gulp.src('sass/*.scss')
    .pipe(compass({
      config_file: 'config.rb',
      css: 'css',
      sass: 'sass'
    }))
    .pipe(gulp.dest('css/'));
});
gulp.task('build', function() {
  return runSequence(['build-root', 'build-sourcejs', 'build-customcss','compass-build', 'build-customcss', 'build-templates'], 'jshint');
});

gulp.task('watch-js', function() {
  gulp.watch('js/*.js', ['build-sourcejs']);
});
// gulp.task('watch-img', function() {
//   gulp.watch('images/**', ['build-images']);
// });
gulp.task('watch-css', function() {
  gulp.watch('css/*.css', ['build-customcss']);
});
gulp.task('compass-watch', function () {
  gulp.watch('sass/*.scss', ['compass-build']);
});
gulp.task('watch-html', function() {
  gulp.watch('templates/*.html', ['build-templates']);
});
gulp.task('watch-root', function() {
  gulp.watch(['index.html','main.js'], ['build-root']);
});
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    host: '0.0.0.0'
  });
});

gulp.task('jshint', function() {
  return gulp.src('js/*js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// default task
gulp.task('default', function() {
  return runSequence('clean', 'build-root','build-templates', 'build-fonts','build-sourcejs', 'jshint', 'build-images', 'build-bower-lib','build-node-lib','compass-build', 'build-customcss',
    ['watch-js', 'watch-css', 'watch-html','watch-root','compass-watch','connect']
  );
});
