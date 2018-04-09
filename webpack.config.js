require('dotenv').config()
const path = require('path')
const nodeExternals = require('webpack-node-externals')


module.exports = {
  context: __dirname,
  target: 'node',
  externals: [nodeExternals()],
  entry: './keystone.js',
  mode: process.env.NODE_ENV,

  output: {
    path: path.resolve(__dirname, './'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
}