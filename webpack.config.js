var webpack = require('webpack');

module.exports = {
    // path must start with ./ relative
    entry: [
        './assets/lib/app.js'
    ],
    output: {
        // filename: './assets/lib/bundle.js',
        path: __dirname,
        filename: './assets/lib/bundle.js',
        publicPath: '/lib/'
    },
    externals: {'react': 'React', 'react-dom': 'ReactDOM'},
    // compress: true,
    module: {
        loaders: [
            {
                test: /.js$/,
                loader: 'babel',
                query: {
                  presets: ['react', 'es2015'],
                  ignore : 'buffer'
                }
            },
            // {
            //     test: /.js$/,
            //     loader: 'jsx-loader'
            // },
            {test: /.less$/, loader: 'style-loader!css-loader!less-loader'},
            { test: /.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=10000&name=./images/[name].[ext]' }
        ]
    }
}
