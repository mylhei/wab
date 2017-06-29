/**
 * Created by leiyao on 16/5/18.
 */
var gulp = require('gulp');
// 引入组件
var minifycss = require('gulp-minify-css'), //css压缩
    //jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'), //js压缩
    concat = require('gulp-concat'), //文件合并
    rename = require('gulp-rename'), //文件更名
    notify = require('gulp-notify'); //提示信息
    
// 合并、压缩js文件
gulp.task('js', function() {
    return gulp.src([
            'components/jquery/dist/jquery.js',
            'components/bootstrap/dist/js/bootstrap.js',
            'components/angular/angular.js',
            'components/angular-route/angular-route.js',
            'components/angular-animate/angular-animate.js',
            'components/angular-cookies/angular-cookies.js',
            'components/angular-resource/angular-resource.js',
            'components/angular-sanitize/angular-sanitize.js',
            'components/angularjs-datetime-picker/angularjs-datetime-picker.js',
            'components/isteven-multi-select/isteven-multi-select.js',
            'components/angular-touch/angular-touch.js',
            'vendor/modules/angucomplete/angucomplete.js',
            'components/angular-ui-router/angular-ui-router.js',
            'components/ngstorage/ngStorage.js',
            'components/angular-bootstrap/ui-bootstrap-tpls.js',
            'components/oclazyload/ocLazyLoad.js',
            'javascripts/app.js',
            'javascripts/config.js',
            'javascripts/config.lazyload.js',
            'javascripts/config.router.js',
            'javascripts/main.js',
            'javascripts/services/ui-load.js',
            'javascripts/filters/fromNow.js',
            'javascripts/directives/setnganimate.js',
            'javascripts/directives/ui-butterbar.js',
            'javascripts/directives/ui-focus.js',
            'javascripts/directives/ui-fullscreen.js',
            'javascripts/directives/ui-jq.js',
            'javascripts/directives/ui-module.js',
            'javascripts/directives/ui-nav.js',
            'javascripts/directives/ui-scroll.js',
            'javascripts/directives/ui-shift.js',
            'javascripts/directives/ui-toggleclass.js',
            'javascripts/directives/ui-validate.js',
            'javascripts/controllers/bootstrap.js',
            'vendor/libs/socket.io-1.2.0.js'
        ])
        //.pipe(uglify({outSourceMap: false, mangle: false}))
        .pipe(concat('all.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('javascripts/dist'))
        // .pipe(notify({
        //   message: 'js task ok'
        // }));
});

gulp.task('css', function() {
    return gulp.src(['stylesheets/bootstrap.css',
            'stylesheets/animate.css',
            'stylesheets/font-awesome.min.css',
            'stylesheets/simple-line-icons.css',
            'stylesheets/font.css',
            'stylesheets/app.css',
            'components/angularjs-datetime-picker/angularjs-datetime-picker.css',
            'components/isteven-multi-select/isteven-multi-select.css',
            'vendor/modules/angucomplete/angucomplete.css'
        ])
        .pipe(minifycss({
            advanced: false
        }))
        .pipe(concat('all.css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('stylesheets'))
        // .pipe(notify({
        //   message: 'css task ok'
        // }));
});

gulp.task('default', function() {
    gulp.run(['js', 'css']);
});
gulp.task('watch', function() {
    gulp.watch(['javascripts/**/*.js', 'components/**/*.js', 'vendor/**/*.js'], ['js']);
    gulp.watch(['stylesheets/*.css', 'components/**/*.css', 'vendor/**/*.js'], ['css']);
});

module.exports = {
    watch: function() {
        gulp.run('watch');
    }
};
