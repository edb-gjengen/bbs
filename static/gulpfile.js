'use strict';
var gulp = require('gulp');

var $ = require('gulp-load-plugins')();
var bowerFiles = require('main-bower-files');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src('app/styles/*.scss')
        .pipe($.sass({
            sourceComments: 'map'
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('scripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('diststyles', function () {
    return gulp.src('app/styles/*.scss')
        .pipe($.sass()
            .on('error', $.sass.logError))
        // TODO: do this with a custom django-compressor filter, too much maintenance otherwise
        // .pipe($.uncss({
        //     html: glob.sync('../templates/**/*.html'),
        //     ignore: [/.*\.dropdown-menu/, /\.tooltip.*/, /\.datepicker.*/, /#inventory-report.*/]
        // }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.csso())
        .pipe(gulp.dest('dist/styles'))
});

gulp.task('distscripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.uglify())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
    return gulp.src(bowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function (cb) {
    return del('dist', cb);
});

gulp.task(
    'build',
    ['distscripts', 'diststyles', 'images', 'fonts'],
    function() {
        return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
    }
);
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
});

gulp.task('watch', ['serve'], function () {
    browserSync.init({
        proxy: '127.0.0.1:8000'
    });

    // watch for changes
    gulp.watch([
        '../templates/**/*.html',
        'app/js/**/*.js',
        'app/images/**/*'
    ]).on('change', reload);

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
});
