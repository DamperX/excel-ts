const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'
  const isDev = !isProd

  const fileName = (ext) => `[name]${isProd ? '.[contenthash]' : ''}.bundle.${ext}`

  const plugins = () => {
    const base = [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body'
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist')
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: fileName('css')
      })
    ]

    if (isDev) {
      base.push(
        new ESLintPlugin({
          extensions: ['js', 'ts']
        })
      )
    }

    return base
  }

  return {
    target: 'web',
    context: path.resolve(__dirname, 'src'),
    entry: {
      main: ['core-js/stable', 'regenerator-runtime/runtime', './index.ts']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: fileName('js'),
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'core')
      }
    },
    devtool: isDev ? 'inline-source-map' : false,
    devServer: {
      open: true,
      port: 3000,
      hot: true,
      watchFiles: './'
    },
    plugins: plugins(),
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }
}
