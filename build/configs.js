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

module.exports = [
  {
    input: {
      input: resolve('src/index.js'),
      // plugins: [
      //   flow(),
      //   node(),
      //   cjs(),
      //   replace({
      //     __VERSION__: version
      //   }),
      //   buble()
      // ]
    },
    output: {
      file: resolve('dist/piece.js'),
      format: 'umd',
      banner,
      name: 'piece-pages'
    }
  }
];

// module.exports = [
//   // browser dev
//   {
//     file: resolve('dist/vue-router.js'),
//     format: 'umd',
//     env: 'development'
//   },
//   {
//     file: resolve('dist/vue-router.min.js'),
//     format: 'umd',
//     env: 'production'
//   },
//   {
//     file: resolve('dist/vue-router.common.js'),
//     format: 'cjs'
//   },
//   {
//     file: resolve('dist/vue-router.esm.js'),
//     format: 'es'
//   }
// ].map(genConfig)

// function genConfig (opts) {
//   const config = {
//     input: {
//       input: resolve('src/index.js'),
//       plugins: [
//         flow(),
//         node(),
//         cjs(),
//         replace({
//           __VERSION__: version
//         }),
//         buble()
//       ]
//     },
//     output: {
//       file: opts.file,
//       format: opts.format,
//       banner,
//       name: 'VueRouter'
//     }
//   }

//   if (opts.env) {
//     config.input.plugins.unshift(replace({
//       'process.env.NODE_ENV': JSON.stringify(opts.env)
//     }))
//   }

//   return config
// }
