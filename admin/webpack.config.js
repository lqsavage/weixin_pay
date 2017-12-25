const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')
const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

const plugins = [
  new ExtractTextPlugin('[name].css', {
    allChunks: true
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'app/index.html'),
    inject: true,
    hash: true,
    filename: 'index.html',
  }),
  new HappyPack({
    id: 'happybabel',
    loaders: ['babel-loader'],
    threadPool: happyThreadPool,
    cache: true,
    verbose: true
  })
]

if(process.env.NODE_ENV === 'production') {
  plugins.push(
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      mangle: true,
      compressor: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
       }
    }),
    new CopyWebpackPlugin(
      [
        {from: path.join(__dirname, 'app/login.html'), to:path.join(__dirname, '/dist')},
        {from: path.join(__dirname, 'app/echarts.min.js'), to:path.join(__dirname, '/dist')}
      ],
      {ignore: [], copyUnmodified: true, debug:"debug"}
    )
  )
}

module.exports = {
  node: {
    fs: "empty"
  },
  entry: [
    './app/main.js',
    './app/css/main.styl',
  ],
  output: {
    path: __dirname + "/dist",
    filename: "main.js",
  },
  module: {
    loaders: [
      { test: /\.js[x]?$/, loader: 'happypack/loader?id=happybabel' },
      {test: /\.vue$/,loader: 'vue-loader'},
      { test: /\.html$/, loader: 'html' },
      // { test: /\.(woff2?|svg|ttf|eot)(\?.*)?$/, loader: 'url' },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
      { test: /\.styl$/, loader: "style-loader!css-loader!stylus-loader?sourceMap"},
    ],
  },
  plugins,
  externals: {
    'text-encoding': 'window'
  }
}