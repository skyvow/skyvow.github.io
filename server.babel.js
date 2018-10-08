import express from 'express'
import proxy from 'express-http-proxy'
import webpack from 'webpack'
import path from 'path'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from './webpack.config.babel'

const app = express()
const compiler = webpack(config)
const port = process.env.PORT || 3000
const hotMiddlewareScript = 'webpack-hot-middleware/client'

config.entry.app.unshift(hotMiddlewareScript)

app.use('/api', proxy('https://api.github.com'))

app.use(webpackDevMiddleware(compiler, {
    logLevel: 'silent',
    publicPath: config.output.publicPath,
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(config.context))

app.use((req, res) => {
    res.sendFile(config.output.path + '/index.html')
})

app.listen(port, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log(`Example app listening on port ${port}!\n`)
    }
})
