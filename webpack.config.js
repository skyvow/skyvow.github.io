var webpack = require('webpack'),
    path = require('path'),
    autoprefixer = require('autoprefixer'),
    cssImport = require("postcss-import"),
    cssMixins = require("postcss-mixins"),
    cssExtend = require("postcss-extend"),
    conditionals = require("postcss-conditionals"),
    cssEach = require("postcss-each"),
    cssFor = require("postcss-for"),
    nested = require('postcss-nested'),
    cssSimpleVars = require("postcss-simple-vars"),
    customMedia = require("postcss-custom-media"),
    cssAtroot = require("postcss-atroot"),
    sprites = require('postcss-sprites')
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin')

// 配置环境
var ENV    = process.env.NODE_ENV,
    isTest = ENV === 'development' || ENV === 'dev',
    isProd = ENV === 'production'  || ENV === 'prod'

// 配置参数
var config = {
    context: path.join(__dirname, ''),
    entry: {
        js: ['./src/app.js'],
        vendor: [
            'react',
            'classnames',
            'react-router',
            'react-dom'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'build/',
        filename: 'assets/js/app.js',
        chunkFilename: 'chunk/[name].chunk.js'
    },
    module: {
        loaders:[
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss', {
                    publicPath: '../../'
                })
            },
            {
                test: /\.(gif|jpg|png)\??.*$/,
                loader: 'url-loader?limit=8192&name=assets/images/[hash].[ext]'
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=assets/fonts/[hash].[ext]'
            },
        ],
    },
    postcss: function (webpack) {

        var dependent = {
            addDependencyTo: webpack
        }

        var processors = [
            cssImport(dependent),
            cssMixins(dependent),
            cssExtend(dependent),
            conditionals(dependent),
            cssEach(dependent),
            cssFor(dependent),
            nested(dependent),
            cssSimpleVars(dependent),
            customMedia(dependent),
            cssAtroot(dependent),
            autoprefixer(dependent)
        ]

        return processors
    },
    plugins: [
        new CleanWebpackPlugin(['build'], {
            root: '',
            verbose: true,
            dry: false
        }),
        // new CopyWebpackPlugin([
        //     {
        //         from: './src/assets/',
        //         to: './assets/'
        //     }
        // ]),
        new ExtractTextPlugin('assets/css/app.css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'assets/js/vendor.js'),
        // new HtmlWebpackPlugin({
        //     template: path.join(__dirname, 'index.html')
        // })
    ],
    resolve: {
        extensions: ['', '.js', '.json', '.css'],
        root: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'src')
        ]
    }
}

if (isProd) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        })
    )
} else {
    config.plugins.push(
        // new OpenBrowserPlugin({
        //     url: 'http://localhost:3000'
        // }),
        new webpack.DefinePlugin({
            DEBUG: true
        })
    )
    config.devtool = 'source-map'
}

module.exports = config
