var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');

var jsFiles = ['*.js', '/src/**/*.js'];

gulp.task('serve', function() {
  env({ file: './.env.ini' });

  var options = {
    script: './index.js',
    delayTime: 1,
    env: {
      'PORT': 3000,
    },
    watch: jsFiles,
  };

  return nodemon(options)
    .on('restart', function(ev) {
      console.log('Restarting...');
    });
});
