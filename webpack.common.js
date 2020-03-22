const path = require('path')

module.exports = {
    entry: ['./static/src/main.js', './static/src/jquery.mark.min.js'],
    output: {
        path: `${__dirname}/static/js/`,
        filename: 'bundle.js'
    }
};