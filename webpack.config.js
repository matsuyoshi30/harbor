module.exports = {
    mode: 'development',
    entry: ['./static/src/main.js', './static/src/jquery.mark.min.js'],
    devtool: 'source-map',
    output: {
        path: __dirname,
        filename: './static/js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
};