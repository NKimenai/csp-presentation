// Imports
const { watch, src, dest, parallel, series } = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const header = require('gulp-header');
const pkg = require('./package.json');

// Location variables
const assetsFolder = './assets/';
const publicDest = './public/';

// Set the banner content
const banner = ['/*!\n',
    ' * Website - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2019-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> <%= pkg.repository %>\n',
    ' * Collaborators <%= pkg.collaborators %>\n',
    ' */\n',
    '\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
function vendor() {
    return src(['node_modules/gsap/dist/gsap.js', 'node_modules/gsap/dist/gsap.min.js'])
        .pipe(dest(publicDest + 'js/gsap'));
}

// Compile all your Sass from your assets folder and put the newly compiled CSS files in your public folder
function scss() {
    return src(assetsFolder + 'sass/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(dest(publicDest + 'css'))
        .pipe(browserSync.stream());
}

// Minify all css files in the public folder
function css() {
    return src([publicDest + 'css/**/*.css', '!public/css/**/*.min.css'])
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(publicDest + 'css'))
        .pipe(browserSync.stream());
}

// Minify all js files from the assets folder and put the minified files in the public folder
function js() {
    // return src(assetsFolder + 'js/**/*.js', { sourcemaps: true })
    //     .pipe(concat('app.min.js'))
    //     .pipe(dest(publicDest + 'js', { sourcemaps: true }))
    // .pipe(browserSync.stream());
    return src( assetsFolder + 'js/**/*.js', { sourcemaps: true })
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(dest(publicDest + 'js', { sourcemaps: true }))
        .pipe(browserSync.stream());
}

// Start up a browserSync server
function syncBrowser () {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        online: true,
        tunnel: "our-csp-presentation",
        ghostMode: true,
    });
}

// Start up a browserSync server and watch all the changes in your Sass, js and HTML
// If there are any changes browserSync will automatically refresh your browser
function devWatch() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html",
            // directory: true,
        },
        online: true,
        tunnel: "our-csp-presentation",
        ghostMode: true,
    });
    watch(assetsFolder + 'sass/**/*.scss').on('change', series(scss, css, browserSync.reload));
    watch(assetsFolder + 'js/**/*.js').on('change', series(js, browserSync.reload));
    watch('./*.html').on('change', browserSync.reload);
}

// Export all your gulp tasks so you can call them up your the terminal
exports.default = series(vendor, scss, css, js);
exports.vendor = vendor;
exports.css = series(scss, css);
exports.js = js;
exports.syncBrowser = syncBrowser;
exports.dev = devWatch;
