const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')

const config = {
    entry: 'js/index.ts',
    input: 'js/index.ts',
    dest: 'dist/bundle.js',
    plugins: [
        nodeResolve({ jsnext: true }), // npmモジュールを`node_modules`から読み込む
        commonjs(), // CommonJSモジュールをES6に変換
        babel(), // ES5に変換
        typescript(), // TS
        json(), // JSON
    ]
}
module.exports = config