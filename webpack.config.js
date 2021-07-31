const { resolve } = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const tsRule = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: 'ts-loader',
}

const plugins = [
  new HTMLWebpackPlugin({
    template: './src/pages/Popup/Popup.html',
    filename: 'Popup.html',
    chunks: ['Popup'],
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: 'public', to: '.' },
    ],
  }),
  new CleanWebpackPlugin(),
]

module.exports = {
  mode: 'production',
  entry: {
    Popup: './src/pages/Popup/Popup.tsx',
    saveRecommendations: './src/scripts/saveRecommendations.ts',
    background: './src/scripts/background.ts',
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [tsRule],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins,
}
