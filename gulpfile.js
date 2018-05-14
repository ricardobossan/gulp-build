/*eslint-env node*/
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['app/**/*.js', '!/app/**/*.min.js', '!node_modules/**'])
	// eslint() attaches the lint output to the "eslint" property
	// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

// Static Server + watching scss/html files
gulp.task('serve', function() {
	browserSync.init({
		server: "./app"
	});
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return gulp.src("app/sass/*.scss")
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.stream());
});


gulp.task('default', ['serve', 'sass', 'lint'], function () {
	gulp.watch("app/sass/*.scss", ['sass']);
	gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch('app/js/*.js', ['lint']);
	// This will only run if the lint task is successful...
});