const gulp = require('gulp'),
	pug = require('gulp-pug'),
	fs = require('fs'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload,
	sass = require('gulp-sass'),
	plumber = require('gulp-plumber'),
	spritesmith = require('gulp.spritesmith'),
	sassGlob = require('gulp-sass-glob'),
	sourcemaps = require('gulp-sourcemaps'),
	csso = require('gulp-csso'),
	autoprefixer = require('gulp-autoprefixer'),
	cssunit = require('gulp-css-unit'),
	del = require('del');

// server
gulp.task('server', function() {
	browserSync.init({
		open: true,
		notify: false,
		server: {
			baseDir: "./dist",
		}
	});
});

gulp.task('sass', () => {
	return gulp.src('./src/sass/main.+(scss|sass)')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({
			browsers : ['> 5%'],
			cascade : false
		}))
		.pipe(cssunit({
			type: 'px-to-rem',
			rootSize: 16
		}))
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css/'))
		.pipe(reload({stream : true}));
});

gulp.task('pug', () => {
	// let locals = require('./content.json');

	gulp.src('src/views/index.pug')
		.pipe(plumber())
		.pipe(pug({
			// locals : locals
			pretty: '	'
		}))
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream : true}));
});

gulp.task('sprite', function () {
	var spriteData = gulp.src(
		'./src/img/icons/*.png'
	).pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.sass',
		cssFormat: 'css',
		imgPath: '../img/sprite.png',
		padding: 70
	}));

	spriteData.img.pipe(gulp.dest('./dist/img'));
	spriteData.css.pipe(gulp.dest('./src/styles/sprite'));
});

// task for clean dist folder before start watch
gulp.task('removedist', function() { return del.sync('dist'); });

gulp.task('watch', () => {
	gulp.watch('src/**/*.pug', ['pug']);
	gulp.watch('src/**/*.+(scss|sass)', ['sass']);
});

gulp.task('default',
	['removedist', 'sass', 'pug', 'sprite', 'server', 'watch']
);
