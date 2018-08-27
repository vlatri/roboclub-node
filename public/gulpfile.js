const gulp = require('gulp')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const babel = require('gulp-babel')


const jsSRC = [
  './js/jquery/*',
  './js/fatNav/*',
  './js/placeholder/*',
  './js/slick/*',
  './js/swipebox/*',
  './js/scripts.js',
]

const onError = err => {
  console.log(err)
  this.emit('end')
}

gulp.task('watch', () => gulp.watch(jsSRC, ['default']))

gulp.task('default', function() {
  return gulp.src(jsSRC)
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./js'))
    .pipe(rename('build.min.js'))
    .pipe(babel({presets: ['minify', 'env']}))
    .on('error', onError)
    .pipe(gulp.dest('./js'))
});
