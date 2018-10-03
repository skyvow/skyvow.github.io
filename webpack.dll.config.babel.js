import webpack from 'webpack'
import path from 'path'
import pkg from './package.json'

// 公共模块
const vendor = Object.keys(pkg.dependencies)
const jsSourcePath = path.join(__dirname, 'src')
// const buildPath = path.join(__dirname, 'build/demo')

export default {
    mode: 'development',
    context: jsSourcePath,
    entry: {
        vendor,
    },
    output: {
        path: path.join(__dirname, 'src/assets/'),
        filename: '[name].dll.js',
        library: '[name]',
    },
    plugins: [
        // 动态链接库，预编译资源模块
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
    ],
    module: {
        noParse: [/html2canvas/, /jspdf/],
    },
}
