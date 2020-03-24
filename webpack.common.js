const path = require('path')

module.exports = {
    entry: ['./static/src/main.js'],
    output: {
        path: `${__dirname}/static/js/`,
        filename: 'bundle.js'
    }
};