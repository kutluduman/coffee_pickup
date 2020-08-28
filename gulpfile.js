const postcss = require('gulp-postcss');
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

gulp.task('css', function () {
    const plugins = [
        autoprefixer({overrideBrowserslist: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src('./public/styles/output.css')
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dest'));
});