var gulp = require('gulp');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var liveReload = require('gulp-livereload');
var uglify = require('gulp-uglify');

var webpack = require('webpack')
var webpackConfig = require('./webpack.config.js')

var rename = require('gulp-rename');
var less = require('gulp-less');

var log = console.log;

function errHandler(err){
    gutil.beep();
    log('err reported by: ', err.plugin);
    log('\tfile:  ', err.fileName);
    log('\tline:  ', err.lineNumber);
    log('\tstack: ', err.stack);
    log('*************************');
    log(err);
}

var productTasks = [undefined, 'default'];
var proEnv = false;

var bundleTask;
bundleTask = 'bundle-gulp-browserify';

var taskName = (process.argv[0] === 'node')? process.argv[2] : process.argv[1];
if( productTasks.indexOf(taskName) >= 0 ){
    proEnv = true;
}

gulp.task('webpack', function(callback) {
    // run webpack
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});


gulp.task('less', function(){
    gulp.src('assets/layout/less/layout.less')
        .pipe(plumber({errorHandler: errHandler}))
        .pipe(less({dumpLineNumbers: 'comments'}))
        .pipe(gulp.dest('assets/layout/css'));
});

gulp.task('watch', function(){
    // gulp-livereload module updated...
    liveReload.listen();

    var file2w = ['./assets/lib/**/*.js', '!./assets/lib/bundle.js'];
    gulp.watch(file2w, ['webpack']);

    gulp.watch('assets/layout/less/**/*.less', ['less']);

    var file2r = ['./views/**/*.jade', './assets/lib/bundle.js', './assets/layout/**/*.css'];
    gulp.watch(file2r, liveReload.changed);
});

gulp.task('default', [ bundleTask, 'less' ]);

gulp.task('wd', [bundleTask, 'less', 'watch']);
