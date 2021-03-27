const path = require('path')

module.exports = {
  entry: {"main.js" : ['./static/src/main.js', './static/src/theme.js']},
  output: {
    path: `${__dirname}/static/js/`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2)$/,
        type: 'asset',
      },
    ]
  }
};
