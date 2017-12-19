var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var cssBase64 = require('gulp-css-base64');
var clear = require('gulp-clean');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var path = require('path');
function Build(options) {

  var _defaults = {
    src: path.join(__dirname, '..', 'src'),
    entry: '',
    base: 'src',
    babel: false,
    uglify: false,
    env: {
      NODE_ENV: 'development'
    },
    dist: path.join(__dirname, '..', 'dist')
  },
    _this = this;
  this.defaults = Object.assign(_defaults, options);
  this.tasks = ['style', 'wxml', 'js', 'json', 'assets'];
  this.tasks.forEach(function(_task) {
    gulp.task(_task, _this[_task].bind(_this));
  });
}
Build.prototype = {
  style: function() {
    return gulp
      .src([this.defaults.src + '/**/*.scss'], { base: this.defaults.src })
      .pipe(plumber())
      .pipe(sass())
      .pipe(cssBase64({
        maxWeightResource: 10000000
      }))
      .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
      .pipe(
        cssnano({
          zindex: false,
          autoprefixer: false,
          discardComments: { removeAll: true }
        })
      )
      .pipe(
        rename(function(path) {
          path.extname = '.wxss';
        })
      )
      .pipe(gulp.dest(this.defaults.dist));
  },
  wxml: function() {
    return gulp
      .src(
        [this.defaults.src + '/**/*.html'],
        { base: this.defaults.src }
      )
      .pipe(
        rename(function(path) {
          path.extname = '.wxml';
        })
      )
      .pipe(gulp.dest(this.defaults.dist))
  },
  assets: function() {
    return gulp
      .src(
        this.defaults.src + '/**/*.{jpeg,png,gif,jpg}',
        { base: this.defaults.src }
      )
      .pipe(gulp.dest(this.defaults.dist))
  },
  json: function() {
    return gulp
      .src(
        this.defaults.src + '/**/*.json',
        { base: this.defaults.src }
      )
      .pipe(gulp.dest(this.defaults.dist));
  },
  js: function() {
    let _relust = gulp.src(this.defaults.src + '/**/*.js', { base: this.defaults.src });
  
    this.defaults.babel && (_relust.pipe(babel({
      presets: ['es2015', 'stage-2']
    })));
    _relust.pipe(replace('process.env', JSON.stringify({NODE_ENV: this.defaults.env.NODE_ENV})));
    this.defaults.uglify && (_relust.pipe(uglify()));
    _relust.pipe(gulp.dest(this.defaults.dist));
    return _relust;
  },
  clear: function() {
    var _this = this;
    gulp.task('clear', function() {
      return gulp
        .src(_this.defaults.dist, {read: false})
        .pipe(clear());
    });
    this.tasks.unshift('clear');
    return this;
  },
  run: function() {
    runSequence(...this.tasks);
    return this;
  },
  watch: function() {
    watch(this.defaults.src, function(file) {
      var _fileType = file.path.split('.').pop();
      switch (_fileType) {
        case 'html':
          runSequence('wxml');
          break;
        case 'scss':
          runSequence('style');
          break;
        case 'js':
          runSequence('js');
          break;
        case 'json':
          runSequence('json');
          break;
      }
    })
  }
}

module.exports = Build;

// module.exports = _build
