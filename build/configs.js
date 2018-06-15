const fs = require('fs');
const path = require('path');
const buble = require('rollup-plugin-buble');
const cjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');
const packageInfo = require('../package');

const utils = require('../utils');

const version = process.env.VERSION || packageInfo.version;

const banner =
`/*!
 * ${utils.initialUpCase(packageInfo.name)} v${version} (date: ${utils.timeformat(new Date())})
 * (c) ${new Date().getFullYear()} xiaoYown
 * @license MIT
 */`;

const resolve = _path => path.resolve(__dirname, '../', _path);

// 整个项目合并入口
const index = [
  {
    input: resolve('src/index.js'),
    file: resolve(`dist/${packageInfo.name}.js`),
    format: 'umd',
    env: 'development',
    name: utils.initialUpCase(packageInfo.name)
  }, {
    input: resolve('src/index.js'),
    file: resolve(`dist/${packageInfo.name}.min.js`),
    format: 'umd',
    env: 'production',
    name: utils.initialUpCase(packageInfo.name)
  }
];
// 细分插件文件目录
const piecesRoot = resolve('src/libs')
// 获取每个细分插件入口文件
const pieces = fs.readdirSync(piecesRoot).reduce((inputs, dir) => {
  const fullDir = path.join(piecesRoot, dir)
  const input = path.join(fullDir, 'index.js')
  if (fs.statSync(fullDir).isDirectory() && fs.existsSync(input)) {
    inputs.push({
      input: input,
      file: resolve('dist/plugins/' + dir + '.min.js'),
      format: 'umd',
      name: 'Piece' + utils.initialUpCase(dir),
      env: 'production'
    })
  }
  return inputs
}, [])

// 所有入口文件数组
const configs = index.concat(pieces);

module.exports = configs.map(getConfig)
// 配置文件生成函数
function getConfig (options) {
  const config = {
    input: {
      input: options.input,
      plugins: [
        node(),
        cjs(),
        replace({
          __VERSION__: version
        }),
        buble()
      ]
    },
    output: {
      file: options.file,
      format: options.format,
      banner: banner.replace(new RegExp(packageInfo.name, 'i'), options.name),
      name: options.name
    }
  }

  if (options.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(options.env)
    }))
  }

  return config
}
