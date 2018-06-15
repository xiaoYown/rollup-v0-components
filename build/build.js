// rollup 依赖
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const uglify = require('uglify-js');
const rollup = require('rollup');
const configs = require('./configs');
const packageInfo = require('../package');
// gulp 依赖
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}
// css 文件打包
// 1. 入口样式参数整理
function dirForCss (entry) {
  const source = entry.input.input.replace(/index\.js$/, 'main.scss');
  var basename = entry.output.file.match(/([\w\.]+)\.js$/)[1];
  var dest = '';
  var suffix = /\.min/.test(basename);

  if (!(new RegExp(packageInfo.name + '\.*')).test(basename)) {
    dest = path.join(__dirname, '../dist/plugins');
    basename = basename.replace(/\.min/, '')
  } else {
    dest = path.join(__dirname, '../dist');
    basename = 'main';
  }

  return {
    source,
    dest,
    basename,
    suffix,
    banner: entry.output.banner + '\n'
  }
}
// 压缩前整理
function cleanPre (input) {
  let nextPipe = null
  
  nextPipe = gulp.src(input.source)
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 40 versions', 'safari 5', 'opera 12.1', 'ios 7', 'android 4']
  }))
  return nextPipe;
}

Object.keys(configs).forEach(key => {
  const input = dirForCss(configs[key]);
  let pipe = cleanPre(input)
  let renameParams = {
    basename: input.basename
  };
  if (input.suffix) {
    renameParams.suffix = '.min';
    pipe
      .pipe(cleanCSS())
      .pipe(rename(renameParams))
      .pipe(header(input.banner))
      .pipe(gulp.dest(input.dest));
  } else {
    pipe
      .pipe(rename(renameParams))
      .pipe(header(input.banner))
      .pipe(gulp.dest(input.dest));
  }
})
// js 文件打包
build(Object.keys(configs).map(key => configs[key]));

function build (builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++;
      if (built < total) {
        next();
      }
    }).catch(logError)
  }
  next();
}

function buildEntry ({ input, output }) {
  const isProd = /min\.js$/.test(output.file);
  return rollup.rollup(input)
    .then(bundle => bundle.generate(output))
    .then(({ code }) => {
      if (isProd) {
        var minified = uglify.minify(code, {
          output: {
            preamble: output.banner,
            /* eslint-disable camelcase */
            ascii_only: true
            /* eslint-enable camelcase */
          }
        }).code
        return write(output.file, minified, true);
      } else {
        return write(output.file, code);
      }
    })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
      resolve();
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err);
          report(' (gzipped: ' + getSize(zipped) + ')');
        })
      } else {
        report();
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError (e) {
  console.log(e);
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
