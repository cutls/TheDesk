const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const terser = require('rollup-plugin-terser').terser
const plugins = process.env.ROLLUP_WATCH === 'true' ? [] : [terser({
    format: {
        comments: false
    },
    compress: {
        drop_console: true
    }
})]
const config = {
    input: 'js/index.ts',
    preferBuiltins: false,
    output: [
        {
            file: './dist/index.js',
            format: 'iife',
            plugins
        }
    ],
    plugins: [
        nodeResolve({ jsnext: true, browser: true, preferBuiltins: false }), // npmモジュールを`node_modules`から読み込む
        commonjs({ transformMixedEsModules: true }), // CommonJSモジュールをES6に変換
        babel(), // ES5に変換
        typescript(), // TS
        json(), // JSON
    ]
}
module.exports = config