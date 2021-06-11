const gulp = require('gulp'),
  sass = require('gulp-sass'),
  terser = require('gulp-terser')

function css(){
  return gulp.src('src/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/stylesheets'))
}

function js(){
  return gulp.src('src/*.js')
    //.pipe(terser())
    .pipe(gulp.dest('./public/javascripts'))
}

function watch(){
  return gulp.watch(["src/*"], () => gulp.parallel([css, js]))
}

exports.css = css
exports.watch = watch
exports.default = gulp.parallel([css, js])