var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-minify-css'),
    concatCss   = require('gulp-concat-css');
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    jshint      = require('gulp-jshint'),
    cache       = require('gulp-cached'),
    prefix      = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload,
    minifyHTML  = require('gulp-minify-html'),
    size        = require('gulp-size'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    shell       = require('gulp-shell'),
    sequence    = require('gulp-sequence');


gulp.task('css', function() {
    var onError = function(err) {
      notify.onError({
          title:    "Gulp",
          subtitle: "Failure!",
          message:  "Error: <%= error.message %>",
          sound:    "Beep"
      })(err);
      this.emit('end');
  };

  return gulp.src('css/*')
    .pipe(plumber({errorHandler: onError}))
    //.pipe(sass())
    .pipe(concatCss('styles/bundle.css', { rebaseUrls: false }))
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "dist/"
        }
    });
});

gulp.task('deploy', function () {
    return gulp.src('dist/**/*')
        .pipe(deploy());
});

gulp.task('js', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(concat('j.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));
});

gulp.task('copy', function () {
  return gulp.src('favicon.ico')
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', function() {
    var opts = {
      comments:true,
      spare:true
    };

  return gulp.src('./*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream:true}));
});

gulp.task('jshint', function() {
  return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch('css/*.css', ['css']);
  gulp.watch('js/*.js', ['jshint', 'js']);
  gulp.watch('./*.html', ['minify-html']);
  gulp.watch('img/*', ['imgmin']);
});

gulp.task('imgmin', function () {
  return gulp.src('img/*')
    .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('s3Sync', shell.task(['aws s3 sync --profile=personal --acl=public-read --region=us-west-2 . s3://vincentandnatalie.com'], { cwd: 'dist' }));

//command: 'aws s3 sync --profile=personal --acl=public-read --region=us-west-2 . s3://vincentcatalano.com', //--content-encoding="gzip"

gulp.task('default', ['js', 'imgmin', 'minify-html', 'css', 'copy', 'watch', 'browser-sync']);

gulp.task('build', ['js', 'imgmin', 'minify-html', 'css', 'copy']);

gulp.task('deploy', sequence(['js', 'imgmin', 'minify-html', 'css'], 's3Sync'));