const path = require('path')

module.exports = {
    entry: ['./static/src/main.js'],
    output: {
        path: `${__dirname}/static/js/`,
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: { url: false }
              }
            ]
          }
        ]
      }
};