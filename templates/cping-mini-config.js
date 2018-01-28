const path = require('path');
const src = path.join(__dirname, 'src');
module.exports = {
  development: {
    babel: true,
    src: src,
    dist: path.join(__dirname, 'dist')
  },
  production: {
    babel: true,
    uglify: true,
    src: src,
    env: {
      NODE_ENV: 'production'
    },
    dist: path.join(__dirname, 'release')
  }
}