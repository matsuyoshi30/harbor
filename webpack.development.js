const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: `${__dirname}/static/js/`,
        filename: 'bundle.js'
    }
  })
