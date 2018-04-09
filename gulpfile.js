const gulp = require('gulp')
const webpack = require('webpack')
const path = require('path')

const baseConfig = require('./webpack.config.js')

gulp.task('build', ['js', 'public', 'templates', 'config'])

const onBuild = done =>
  (err, stats) => {
    err ?
      console.log('Error', err) :
      console.log(stats.toString())
    done && done()
  }

gulp.task('js', done =>
  webpack(baseConfig).run(onBuild(done))
)

gulp.task('public', () =>
  gulp.src('./public/**').pipe(gulp.dest('./build/public'))
)

gulp.task('templates', () =>
  gulp.src('./templates/**').pipe(gulp.dest('./build/templates'))
)

gulp.task('config', () =>
  gulp.src(['./package.json']).pipe(gulp.dest('./build'))
)
