import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import image from '@rollup/plugin-image'
import styles from 'rollup-plugin-styles'
import autoprefixer from 'autoprefixer'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import fs from 'fs'
import path from 'path'
import pack from './package.json'

const banner = `/*!
*
* ${pack.name} ${pack.version}
*
* Copyright 2021-present, ${pack.title}, Inc.
* All rights reserved.
*
*/`

/**
 * 入口文件
 */
const entryFile = 'src/index.ts'

const componentDir = 'src/components'
const cModuleNames = fs.readdirSync(path.resolve(componentDir))
const componentEntryFiles = cModuleNames
  .map(name => (/^[A-Z]\w*/.test(name) ? `${componentDir}/${name}/index.tsx` : undefined))
  .filter(n => !!n)

const external = ['react', 'react-dom', '@lyrical/js']
const globals = { react: 'React', 'react-dom': 'ReactDOM', '@lyrical/js': 'lyricalJs' }

const commonPlugins = [
  /* 将图片打包进 js */
  image(),
  /* 自动匹配文件后缀 */
  resolve({ extensions: ['.ts', '.tsx'] }),
  babel({
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
    extensions: ['.ts', '.tsx'],
    skipPreflightCheck: true,
    presets: ['@babel/preset-react', '@babel/preset-typescript']
  }),
  commonjs()
]

const stylePluginConfig = {
  mode: 'extract',
  less: { javascriptEnabled: true },
  extensions: ['.styl', '.css'],
  minimize: false,
  use: ['stylus'],
  url: {
    inline: true
  },
  plugins: [autoprefixer()]
}

const splitOutput = {
  globals,
  preserveModules: true,
  preserveModulesRoot: 'src',
  exports: 'named',
  assetFileNames: ({ name }) => {
    const { ext, dir, base } = path.parse(name)
    if (ext !== '.css') return '[name].[ext]'
    // 规范 style 的输出格式
    return path.join(dir, 'style', base)
  }
}

export default [
  {
    input: entryFile,
    output: {
      format: 'umd',
      name: 'lyricalReact',
      globals,
      assetFileNames: '[name].[ext]',
      file: 'dist/index.js',
      banner
    },
    plugins: [styles(stylePluginConfig), ...commonPlugins],
    external
  },
  {
    input: entryFile,
    output: {
      format: 'umd',
      name: 'lyricalReact',
      globals,
      assetFileNames: '[name].[ext]',
      file: 'dist/index.min.js',
      plugins: [terser()],
      banner
    },
    plugins: [styles({ ...stylePluginConfig, minimize: true }), ...commonPlugins],
    external
  },
  {
    input: [entryFile, ...componentEntryFiles],
    preserveModules: true,
    output: { ...splitOutput, format: 'es', dir: 'es' },
    plugins: [styles(stylePluginConfig), typescript({ jsx: 'preserve' }), ...commonPlugins],
    external
  },
  {
    input: [entryFile, ...componentEntryFiles],
    preserveModules: true,
    output: { ...splitOutput, format: 'cjs', dir: 'lib' },
    plugins: [styles(stylePluginConfig), typescript({ jsx: 'preserve' }), ...commonPlugins],
    external
  }
]
