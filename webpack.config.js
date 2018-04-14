require('dotenv').config()
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = function(env) {
  const frontend = env.side === 'frontend'
  return {
    context: path.resolve(__dirname),
    target: frontend ? 'web' : 'node',
    externals: frontend ? [] : [nodeExternals()],
    entry: frontend ? './public/js/scripts.js' : './keystone.js',
    output: {
      path: path.resolve(__dirname, frontend ? './public/js/': ''),
      filename: 'build.js'
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          query: {
            // Can't use .babelrc because some weird things happen to ./node_modules/keystone/admin/bundles/index.js
            "plugins": [
              ["transform-runtime", {
                "polyfill": false,
                "regenerator": true
              }],
              "transform-object-rest-spread"
            ],
            "presets": ["latest", "es2015", "stage-0"]
          }
        }
      }]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
  }
}