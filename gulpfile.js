var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

var publicDest = './public/';
var assetsFolder = './assets/';

// Set the banner content
var banner = ['/*!\n',
    ' * Website - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2019-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/basvdbrink1/csp3\n',
    ' */\n',
    '\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {
    // Gsap
    gulp.src([
        './node_modules/gsap/src/minified/**/*',
    ])
        .pipe(gulp.dest(publicDest + './js/gsap'));
});

// Compile SCSS
gulp.task('css:compile', function() {
    return gulp.src(assetsFolder + 'sass/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(publicDest + 'css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
    return gulp.src([
        publicDest + 'css/**/*.css',
        '!' + publicDest + 'css/**/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(publicDest + './css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
    return gulp.src([
        publicDest + '/js/*.js',
        '!' + publicDest + '/js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest(publicDest + './js'))
        .pipe(browserSync.stream());
});

// JS
gulp.task('js', ['js:minify']);

// Default task
gulp.task('default', ['css', 'js', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        // proxy: "localhost:8080",
        // ui: {
        //     port: 8080
        // },
        server: {
            port: 8080,
            baseDir: "./"
        }
    });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
    gulp.watch(assetsFolder + 'sass/**/*.scss', ['css']);
    gulp.watch(publicDest + 'js/*.js', ['js']);
    gulp.watch('./*.html', browserSync.reload);
});
