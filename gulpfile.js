/*eslint-env node*/
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const jasmine = require('jasmine');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = (require('gulp-sourcemaps'));
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('default', ['copy-html', 'copy-images', 'sass', 'lint'], () =>  {
	gulp.watch("app/sass/*.scss", ['sass']);
	gulp.watch("dist/index.html").on('change', browserSync.reload);
	gulp.watch('app/js/*.js', ['lint']);
	gulp.watch('app/index.html', ['copy-html']);

	browserSync.init({
		server: "./dist"
	});
});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'sass',
	'lint',
	'scripts-dist'
]);

gulp.task('scripts', () => {
	gulp.src('app/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', () => {
	gulp.src('app/js/**/*.js')
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['app/js/*.js', '!/app/**/*.min.js', '!node_modules/**'])
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

gulp.task('tests', () =>  {
	gulp.src('tests/spec/extraSpec.js')
		.pipe(jasmine({
			integration: true,
			vendor: 'app/js/**/*.js',
			keepRunner: './'
		}));
});

// Static Server + watching scss/html files
/*gulp.task('serve', function() {
	browserSync.init({
		server: "./app"
	});
});
*/
// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
	return gulp.src("./app/sass/**/*.scss")
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest("dist/css"))
		.pipe(browserSync.stream());
});

gulp.task('copy-html', () => {
	gulp.src('app/index.html')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', () => {
	gulp.src('app/img/*')
		.pipe(gulp.dest('dist/img'));
});

gulp.task('png-optim', () =>
	gulp.src('app/img/*')
		.pipe(imagemin([pngquant()]))
		.pipe(gulp.dest('dist/img')));