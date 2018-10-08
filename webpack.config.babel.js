// 引入依赖
import webpack from 'webpack'
import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlWebpackIncludeAssetsPlugin from 'html-webpack-include-assets-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import HappyPack from 'happypack'
import os from 'os'
import pkg from './package.json'
import manifest from './manifest.json'

// 配置环境
const ENV = process.env.NODE_ENV
const isDev = ENV === 'development' || ENV === 'dev'
const isProd = ENV === 'production' || ENV === 'prod'

// 公共模块
const vendor = Object.keys(pkg.dependencies)
const jsSourcePath = path.join(__dirname, 'src')
const buildPath = path.join(__dirname, 'build/demo')
const sourcePath = path.join(__dirname, 'src')
const assetsPath = 'assets/'
const port = process.env.PORT || 3000

// 开启 happypack 多进程的模式加速编译
class HappyPackPlugin {
    constructor () {
        this.init()
    }

    init () {
        this.threadPool = HappyPack.ThreadPool({
            size: os.cpus().length,
        })
        this.caches = {
            loaders: {},
            plugins: [],
        }
    }

    createPlugin (id, loaders) {
        this.caches.loaders[id] = {
            loaders,
            happypack: `happypack/loader?id=${id}`,
        }

        this.caches.plugins.push(new HappyPack({
            id,
            loaders,
            threadPool: this.threadPool,
            verboseWhenProfiling: false,
            verbose: true,
            debug: false,
        }))

        return this
    }

    getLoaders (id, isProd) {
        const { loaders, happypack } = this.caches.loaders[id]
        return isProd ? loaders : happypack
    }
}

// 创建 happypack 实例对象
const happyLoader = new HappyPackPlugin

happyLoader
    .createPlugin('js', ['cache-loader', 'babel-loader'])
    .createPlugin('css', ['css-loader', 'postcss-loader'])

const jsLoader = isDev ? [happyLoader.getLoaders('js')] : ['babel-loader']
const cssLoader = isDev ? [happyLoader.getLoaders('css')] : ['css-loader', 'postcss-loader']

// 配置参数
const config = {
    context: jsSourcePath,
    entry: {
        app: [
            './app.js',
        ],
        vendor,
    },
    output: {
        path: buildPath,
        publicPath: '',
        filename: assetsPath + 'app.js',
        chunkFilename: assetsPath + '[name].chunk.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [...jsLoader],
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.css/,
                use: [
                    'css-hot-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    ...cssLoader,
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)\??.*$/,
                use: 'url-loader?limit=8192&name=' + assetsPath + '[hash].[ext]',
            },
            {
                test: /\.(woff|svg|eot|ttf)\??.*$/,
                use: 'url-loader?limit=8192&name=' + assetsPath + '[hash].[ext]',
            },
        ],
        noParse: [/html2canvas/, /jspdf/],
    },
    plugins: [
        // 进度条
        new ProgressBarPlugin(),
        // 复制静态文件
        // new CopyWebpackPlugin([{
        //     from: './assets/',
        //     to: './assets/',
        // }]),
        // 合并所有的 CSS 文件
        new MiniCssExtractPlugin({
            filename: assetsPath + '[name].css',
            chunkFilename: assetsPath + '[id].css',
        }),
        // 自动生成页面
        new HtmlWebpackPlugin({
            template: path.join(sourcePath, 'index.html'),
            path: buildPath,
            filename: 'index.html',
        }),
    ],
    optimization: {
        // runtimeChunk: {
        //     name: 'manifest'
        // },
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/,
                },
            },
        },
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.css',
        ],
    },
    stats: {
        modules: false,
        children: false,
    },
    performance: {
        hints: false,
    },
    devServer: {
        contentBase: isProd ? buildPath : sourcePath,
        // historyApiFallback: true,
        port,
        // compress: isProd,
        hot: !isProd,
        noInfo: true,
        inline: !isProd,
        // disableHostCheck: true,
        host: '0.0.0.0',
    },
}

// 开发环境
if (isDev) {
    Object.assign(config, {
        mode: 'development',
        plugins: [
            ...config.plugins,
            // html 中引入 dll.js 文件
            new HtmlWebpackIncludeAssetsPlugin({
                assets: ['vendor.dll.js'],
                append: false,
                publicPath: assetsPath,
            }),
            // 抽离并打包变动不频繁的模块
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest,
            }),
            // happypack 插件
            ...happyLoader.caches.plugins,
            // 开启全局的模块热替换(HMR)
            new webpack.HotModuleReplacementPlugin(),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                // 开发环境全局变量配置
                // path.resolve(__dirname, 'dev.config.js'),
                ...config.entry.app,
            ],
        }),
        // 产生.map文件，方便调试
        devtool: 'source-map',
    })
}

// 生产环境
if (isProd) {
    Object.assign(config, {
        mode: 'production',
        plugins: [
            ...config.plugins,
            // 清除文件
            new CleanWebpackPlugin(['build'], {
                root: '',
                verbose: true,
                dry: false,
            }),
            // 压缩成 gzip 格式
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0,
            }),
        ],
        entry: Object.assign({}, config.entry, {
            app: [
                // 生产环境全局变量配置
                // path.resolve(__dirname, 'prod.config.js'),
                ...config.entry.app,
            ],
        }),
        optimization: Object.assign({}, config.optimization, {
            minimizer: [
                ...config.optimization.minimizer,
                // 打包压缩 JS 文件
                new UglifyJsPlugin({
                    uglifyOptions: {
                        warnings: false,
                        compress: {
                            drop_console: true,
                        },
                    },
                }),
            ],
        }),
    })
}

export default config
