'use strict';
var gulp = require('gulp');
var glob = require('glob');

// load plugins
var $ = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files'); // TODO: use these

gulp.task('styles', function () {
    return gulp.src('app/styles/*.scss')
        .pipe($.plumber())
        .pipe($.sass({
            errLogToConsole: true
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

gulp.task('scripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe(gulp.dest('dist/js'))
        .pipe($.size());
});

gulp.task('diststyles', function () {
    return gulp.src('app/styles/*.scss')
        .pipe($.plumber())
        .pipe($.sass({
            errLogToConsole: true
        }))
        // TODO: do this with a custom django-compressor filter, too much maintenance otherwise
        // .pipe($.uncss({
        //     html: glob.sync('../templates/**/*.html'),
        //     ignore: [/.*\.dropdown-menu/, /\.tooltip.*/, /\.datepicker.*/, /#inventory-report.*/]
        // }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe($.csso())
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

gulp.task('distscripts', function () {
    return gulp.src('app/js/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe($.size());
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src(mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['dist'], { read: false }).pipe($.clean());
});

gulp.task('build', ['distscripts', 'diststyles', 'images', 'fonts']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('serve', ['styles'], function () {
    require('opn')('http://localhost:8000');
});

gulp.task('watch', ['serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        '../templates/**/*.html',
        'app/js/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
});
