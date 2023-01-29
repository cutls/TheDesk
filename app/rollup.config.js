const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const terser = require('rollup-plugin-terser').terser
const config = {
    input: 'js/index.ts',
    output: [
        {
            file: './dist/index.js',
            format: 'iife',
            plugins: [terser({
                format: {
                    comments: false
                },
                compress: {
                    drop_console: process.env.ROLLUP_WATCH !== 'true'

                }
            })],
            sourcemap: true,
        }
    ],
    plugins: [
        nodeResolve({ jsnext: true, browser: true, preferBuiltins: false }), // npmモジュールを`node_modules`から読み込む
        commonjs({ transformMixedEsModules: true }), // CommonJSモジュールをES6に変換
        typescript(), // TS
        json(), // JSON
    ]
}
module.exports = config