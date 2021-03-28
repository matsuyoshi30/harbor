const path = require('path')

module.exports = {
  entry: {
    main: ['./static/src/main.js', './static/src/theme.js'],
    search: './static/src/search.js',
  },
  output: {
    path: `${__dirname}/static/js/`,
    filename: '[name].bundle.js'
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
