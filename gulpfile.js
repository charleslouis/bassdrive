'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	shell = require('gulp-shell'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade');


var paths = {
	'scripts':{
		front: {
			vendors: [
				'./bower_components/modernizr/modernizr.js',
				'./bower_components/jquery/dist/jquery.js',
				'./bower_components/jquery-placeholder/jquery.placeholder.js',
				'./bower_components/angular/angular.js',
				'./bower_components/angular-animate/angular-animate.js',
				'./bower_components/angular-ui-router/release/angular-ui-router.js',
				'./bower_components/fastclick/lib/fastclick.js',
				'./node_modules/foundation-apps/js/angular/services/foundation.core.js',
				'./node_modules/foundation-apps/js/angular/services/foundation.core.animation.js',
				'./node_modules/foundation-apps/js/angular/components/accordion/accordion.js',
				'./node_modules/foundation-apps/js/angular/components/tabs/tabs.js',
				'./radio/components/iconic/iconic.js',
				'./radio/js/custom/yql.js',
				'./radio/js/custom/parse-bassdrive.js',
				'./radio/js/custom/app.js'
			],
			sources: ['./radio/js/custom/*'],
			output: {
				folder: './radio/js/',
				mainScriptsFile: 'scripts.js'
			}
		}
	},
	'style': {
		all: './radio/styles/**/*.scss',
		output: './radio/styles/'
	},
	'jadeFiles': {
		templates: './radio/*.jade'
	},
	'html': {
		distFolder: './radio/',
		distFiles: './radio/*.html'
	}	


};


// ----------   LINT   -----
// 
// gulp.task('lintBack', function(){
// 	gulp.src(paths.scripts.back)
// 		.pipe(jshint())
// 		.pipe(jshint.reporter(jshintReporter));
// });


// ----------   SASS   -----
// 
gulp.task('sass:dev', function () {
  gulp.src(paths.style.all)
	.pipe(sourcemaps.init())
	.pipe(sass({includePaths: [ './radio/styles/foundation' ]}).on('error', sass.logError))
	.pipe(gulp.dest(paths.style.output))
	.pipe(livereload());
});
 
gulp.task('sass:build',function () {
  gulp.src(paths.style.all)
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifycss())
	.pipe(gulp.dest(paths.style.output));
});


// ----------   JSCONCAT   -----
// 
gulp.task('jsconcat:dev', function() {
  return gulp.src(paths.scripts.front.vendors, paths.scripts.front.sources)
	// .pipe(jshint())
	// .pipe(jshint.reporter(jshintReporter))
    .pipe(concat(paths.scripts.front.output.mainScriptsFile))
    .pipe(gulp.dest(paths.scripts.front.output.folder))
    .pipe(livereload());
});

gulp.task('jsconcat:build', function() {
  return gulp.src(paths.scripts.front.vendors, paths.scripts.front.sources)
    .pipe(concat(paths.scripts.front.output.mainScriptsFile))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.front.output.folder));
});


//----------- JADE -> HTML -------------------
gulp.task('jadeHtml', function() {
 
  gulp.src(paths.jadeFiles.templates)
    .pipe(jade({
      locals: paths.jadeFiles.templates
    }))
    .pipe(gulp.dest(paths.html.distFolder))
    .pipe(livereload());
});

//-----------   SERVER   ---------------------
gulp.task('server:start', function() {
  connect.server({
    port: 8000
  });
  // server close ?
});


//-----------   WATCHERS   ---------------------

// gulp watcher for sass
gulp.task('watch:sass', function () {
	livereload.listen();
	gulp.watch(paths.style.all, ['sass:dev']);
});

// gulp watcher for lint
// gulp.task('watch:lintBack', function () {
// 	gulp.src(paths.scripts.back)
// 		.pipe(watch())
// 		.pipe(jshint())
// 		.pipe(jshint.reporter(jshintReporter));
// });

// gulp watcher for js
gulp.task('watch:js', function () {
	livereload.listen();
	gulp.watch(paths.scripts.front.sources, ['jsconcat:dev']);
});

gulp.task('watch:jadeHtml', function () {
  livereload.listen();
  gulp.watch(paths.jadeFiles.templates, ['jadeHtml']);
  gulp.watch(paths.html.distFiles).on('change', livereload.changed);
});

// gulp watch sass, lint & js
gulp.task('watch', [
  'watch:sass',
  // 'watch:lintBack',
  'watch:js',
  'watch:jadeHtml'
]);


// ----------   RUN tasks   ------------------
// gulp run Keystone
// gulp.task('runKeystone', shell.task('node keystone.js'));

// default task (watch & serve)

gulp.task('serve', ['server:start', 'watch'],function () {
});
