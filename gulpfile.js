var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean =require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var htmlmin = require('gulp-htmlmin');
var gulpPug = require('gulp-pug');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');


var env = process.env.NODE_ENV || 'development';

var SOURCEPATHS = {
  sassSource : 'src/scss/**/*.scss',  
  sassApp: 'src/scss/app.scss',
  pugSource : 'src/templates/**/*.pug',
  jsSource : 'src/js/main.js',
  imgSource : 'src/img/**'
}
var APPPATH ={
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
}

gulp.task('clean-html', function() {
  return gulp.src(APPPATH.root + '/*.html', {read: false, force: true })
      .pipe(clean());
});
gulp.task('clean-scripts', function() {
  return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
      .pipe(clean());
});

gulp.task('clean-images', function() {
  return gulp.src(APPPATH.img + '/**', {read: false, force: true })
      .pipe(clean());
});

gulp.task('sass', function(){

	var config = {};

	if(env === 'development'){
		config.sourceComments = "map";
	}

	if(env === 'production'){
		config.outputStyle = "compressed";
	}

	return gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer())
		.pipe(sass(config).on('error', sass.logError))
		.pipe(gulp.dest(APPPATH.css))
});

gulp.task('images', ['clean-images'], function() {
    return gulp.src(SOURCEPATHS.imgSource)
      .pipe(newer(APPPATH.img))
      .pipe(imagemin())
      .pipe(gulp.dest(APPPATH.img));
});


gulp.task('scripts',['clean-scripts'],  function() {
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(browserify({ debug: env === 'development' }))
		.pipe(gulpIf(env === 'production', uglify()))
		.pipe(gulp.dest(APPPATH.js))
});

/** Production Tasks **/
gulp.task('compress',  function() {
  gulp.src(SOURCEPATHS.jsSource)
      .pipe(browserify())
      .pipe(minify())
      .pipe(gulp.dest(APPPATH.js))
});

gulp.task('compresscss', function(){

  var sassFiles;
  sassFiles = gulp.src(SOURCEPATHS.sassSource)
      .pipe(autoprefixer())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

          .pipe(concat('app.css'))
          .pipe(cssmin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(APPPATH.css));
});


/** End of Production Tasks **/

gulp.task('pug', function() {
	return gulp.src(SOURCEPATHS.pugSource)
		.pipe(gulpPug())
		.pipe(clean())
		.pipe(gulp.dest(APPPATH.root))
});
/*
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
      .pipe(gulp.dest(APPPATH.root))
});
*/

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'images', 'pug'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    //gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
    gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
    gulp.watch([SOURCEPATHS.imgSource], ['images', 'clean-images']);
	gulp.watch([SOURCEPATHS.pugSource], ['pug']);
} );

gulp.task('default', ['watch']);

gulp.task('production', ['compresscss', 'compress'] );
