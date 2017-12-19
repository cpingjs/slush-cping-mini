var gulp = require('gulp');
var path = require('path');
var Build = require('./gulplib/build');
gulp.task('default', function() {
  new Build({
    babel: true
  })
    .clear()
    .run()
    .watch();
});
gulp.task('release', function() {
  new Build({
    babel: true,
    uglify: true,
    env: {
      NODE_ENV: 'production'
    },
    dist: path.join(__dirname, 'release')
  })
    .run();
})






