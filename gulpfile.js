const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('scss', function () {
  return gulp
    .src([
      'src/pages/index.scss',
      'src/pages/listMembers.scss'])
    .pipe(
      sass({
        outputStyle: 'compressed',
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', gulp.series('scss'));
});

gulp.task('default', gulp.series('scss', 'watch'));
