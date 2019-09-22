const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');

// Styles
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const minify = require('gulp-cssnano');
const cleanCss = require('gulp-clean-css');

// Scripts
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// HTML
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');

// Images
const imagemin = require('gulp-imagemin');

// ------------------------ TASKS ------------------------

const PATHS = {
  input: 'src/',
  output: './dist/',
  scripts: {
    input: 'src/js/*.js',
  },
  styles: {
    input: './src/sass/**/*.scss',
  },
  html: {
    input: 'src/html/pages/*.html',
    watch: './src/html/**/*.html'
  },
  images: {
    input: 'src/img/**/*',
  },
  reload: './dist/'
};

gulp.task('clean', function () {
  return del([ 'dist' ]);
});

gulp.task('move', function () {
  return gulp.src([ './src/assets/**/*', './src/php/**/*.php' ])
    .pipe(gulp.dest('./dist'));
})

gulp.task('images', function () {
  return gulp.src(PATHS.images.input)
    .pipe(imagemin())
    .pipe(gulp.dest(PATHS.output + '/img/'));
});

gulp.task('fileinclude', function () {
  return gulp.src(PATHS.html.input)
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '#',
      basepath: './src/html/pages'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('fileinclude:prod', function () {
  return gulp.src(PATHS.html.input)
    .pipe(fileinclude({
      prefix: '#',
      basepath: './src/html/pages'
    }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('css:dev', function () {
  return gulp
    .src(PATHS.styles.input)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATHS.output))
    .pipe(browserSync.stream());
});

gulp.task('css:prod', function () {
  return gulp
    .src(PATHS.styles.input)
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(
      prefix({
        browsers: [ 'last 2 version', '> 0.25%' ],
        cascade: true,
        remove: true
      })
    )
    .pipe(
      minify({
        discardComments: {
          removeAll: true
        }
      })
    )
    .pipe(gulp.dest(PATHS.output));
});

gulp.task('js:dev', function () {
  return gulp
    .src([ 'src/js/libs/*.js', 'src/js/index.js' ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest(PATHS.output))
    .pipe(browserSync.stream());
})

gulp.task('babel', function () {
  return gulp.src('src/js/index.js')
    .pipe(babel({
      presets: [ '@babel/env' ]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.output))
});

gulp.task('js:prod', function () {
  return gulp
    .src([ 'src/js/libs/*.js', 'dist/index.js' ])
    .pipe(concat('index.js'))
    .pipe(gulp.dest(PATHS.output))
});

gulp.task('watch', function (cb) {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });

  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch(PATHS.styles.input).on('change', gulp.series('css:dev'), browserSync.reload);
  gulp.watch(PATHS.scripts.input).on('change', gulp.series('js:dev'), browserSync.reload);
  gulp.watch(PATHS.images.input).on('change', gulp.series('images'), browserSync.reload);
  gulp.watch(PATHS.html.watch).on('change', gulp.series('fileinclude'), browserSync.reload);
  cb();
});

gulp.task('default', gulp.series('clean', 'css:dev', 'js:dev', 'images', 'fileinclude', 'watch'));
gulp.task('build', gulp.series('clean', 'fileinclude:prod', 'babel', 'css:prod', 'js:prod', 'images'));