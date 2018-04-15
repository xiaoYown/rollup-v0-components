const fs = require('fs');
const path = require('path');
const buble = require('rollup-plugin-buble');
const flow = require('rollup-plugin-flow-no-whitespace');
const cjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

const version = process.env.VERSION || require('../package.json').version;
const banner =
`/*!
  * piece-plugins v${version}
  * (c) ${new Date().getFullYear()} xiaoYown
  * @license MIT
  */`;

const resolve = _path => path.resolve(__dirname, '../', _path);

const index = [
  {
    input: resolve('src/index.js'),
    file: resolve('dist/piece.js'),
    format: 'umd',
    env: 'production'
  }
];

const piecesRoot = resolve('examples')

const pieces = fs.readdirSync(piecesRoot).reduce((inputs, dir) => {
  const fullDir = path.join(piecesRoot, dir)
  const input = path.join(fullDir, 'app.js')
  if (fs.statSync(fullDir).isDirectory() && fs.existsSync(input)) {
    inputs.push({
      input: input,
      file: resolve('dist/' + dir + '.js'),
      format: 'es',
      name: 'Piece' + dir.replace(/^\w/, character => character.toUpperCase()),
      env: 'production'
    })
  }
  return inputs
}, [])

// console.log(pieces)

const configs = index.concat(pieces);

module.exports = configs.map(getConfig)

function getConfig (options) {
  const config = {
    input: {
      input: options.input,
      plugins: [
        flow(),
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
      banner,
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
