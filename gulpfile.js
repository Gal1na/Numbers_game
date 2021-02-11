"use strict";

const gulp = require('gulp');
const notify = require("gulp-notify");
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const terser = require('gulp-terser');
const rename = require("gulp-rename");
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const argv = require('yargs').argv;
const concat = require('gulp-concat');
const through2 = require('through2');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

let isSound = false;


/*== Paths to source/build/watch files ==*/
let path = {
    build: {
        js: 'dist/js/',
        css: 'dist/css/',
        html: 'dist/',
        img: 'dist/img/'
    },
    src: {
        js: 'src/js/',
        css: 'src/scss/main.scss',
        html: 'src/*.html',
        img: 'src/img/**/*'
    },
    watch: {
        js: "src/js/",
        css: 'src/scss/**/*.scss',
        html: 'src/*.html',
        img: 'src/img/**/*'
    }
};

/* Compile SASS */
const styles = (done) => {
    gulp.src(path.src.css)
        .pipe(plumber())
        .pipe(gulpIf(argv.dev, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({suffix: '.min'}))
        .pipe(csso())
        .pipe(gulpIf(argv.dev, sourcemaps.write()))
        .pipe(gulp.dest(path.build.css))
        .pipe(gulpIf(argv.dev, notify({message: 'Styles task complete', onLast: true, sound: isSound})))
        .pipe(gulpIf(argv.dev, browserSync.stream()));
    done();
}
exports.styles = styles;

/* Compile JS */
function buildJs(sourceFile, destPath, concatenationName) {
    gulp.src(sourceFile)
        .pipe(plumber())
        .pipe(gulpIf(argv.dev, sourcemaps.init()))
        .pipe(concatenationName ? concat(concatenationName) : through2.obj())
        .pipe(gulp.dest(destPath))
        .pipe(rename({suffix: '.min'}))
        .pipe(terser())
        .pipe(gulpIf(argv.dev, sourcemaps.write('./')))
        .pipe(gulp.dest(destPath))
        .pipe(gulpIf(argv.dev, notify({ message: (concatenationName ? concatenationName : 'Scripts Single') + ' task complete', onLast: true, sound: isSound })))
        .pipe(gulpIf(argv.dev, browserSync.stream()));
}

let listSrcMain = [
    'node_modules/jquery/dist/jquery.min.js',
    path.src.js +'**/*.js',
]


/* Build Main JS */
const scriptsMain = (done) => {
    buildJs(listSrcMain, path.build.js, 'main.js');
    done();
}
exports.scriptsMain = scriptsMain;


/* Task HTML */
const html = (done) => {
  gulp.src(path.src.html)
      .pipe(gulp.dest(path.build.html))
      .pipe(gulpIf(argv.dev, notify({message: 'HTML task complete', onLast: true, sound: isSound})))
      .pipe(gulpIf(argv.dev, browserSync.stream()));
  done();
}
exports.html = html;


/*Optimize Images*/
const images = (done) => {
  gulp.src(path.src.img)
      .pipe(plumber())
      .pipe(newer(path.build.img))
      .pipe(imagemin()) //не настроен
      .pipe(gulp.dest(path.build.img))
      .pipe(gulpIf(argv.dev, browserSync.stream()));
  done();    
}
exports.images = images;

const cleanimg = () => {
  return del('dist/img/**/*', { force: true });
}
exports.cleanimg = cleanimg;

const cleandist = () => {
  return del('dist/**/*', { force: true });
}
exports.cleandist = cleandist;


/* Browser-sync Static server */
const browserSyncServer = () => {
    browserSync.init({
        server: { baseDir: 'dist/' },
        notify: false, // что это?
        online: true // что это?
    });
}
exports.browserSyncServer = browserSyncServer;


/* Watcher */
const watch = () => {
    gulp.watch(path.watch.css, styles);
    gulp.watch(path.watch.js + '*.js', scriptsMain);
    gulp.watch(path.watch.img, images);
    gulp.watch(path.watch.html, html);
}
exports.watch = watch;


/* Production build Task */
const prod = gulp.series(cleandist, images, html, styles, scriptsMain);
exports.prod = prod;

/* Develop build Task */
const dev = gulp.series(prod, gulp.parallel(watch, browserSyncServer));
exports.default = dev;