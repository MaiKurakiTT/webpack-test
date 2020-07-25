const path = require('path') //nodejs内置模块
// 导入 Webpack 配置对象的类型, 为了标注 config 对象的类型
// 配置完成后注释掉,nodejs环境不支持import
// import { Configuration } from 'webpack'
// 或者在注释中导入
/** @type {import('webpack').Configuration} */

const webpack = require('webpack')


const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') //默认导出的就是插件类型，不需要再解构内部成员
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const RemoveCommentsPlugin = require('./remove-comments-plugin.js')

const config = {
    entry: './src/main.js', // 打包的入口文件路径
    // entry: './src/main.css', // 打包css资源文件
    // 输出文件的位置, 对象
    output: {
        filename: 'bundle.js', // 输出文件文件名
        path: path.join(__dirname, 'dist') // 输出目录
    },
    mode: 'none', //工作模式
    module: {
        // 针对资源模块加载的配置规则
        rules: [
            {
                test: /\.css$/, //正则表达式,匹配打包中所遇的文件路径,这里匹配以.css结尾
                //用来指定匹配到的文件所需的loader
                // 执行顺序从后往前,先将css转为js,css-loader要放在最后
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.md$/,
                use:
                    // 'html-loader',
                    './markdown-loader.js' // 还可使用模块文件路径

            },
            {
                // Tree-shaking 实现前提是 ES Modules
                // npm install -D babel-loader @babel/core @babel/preset-env webpack
                // 安装完成后,优化项只留一个usedExports,打包后正常工作了,并未出现Tree-shaking失效
                // 因为最新（8.x）的babel-loader，自动关闭了对 ES Modules 转换的插件, 不会被转换为CommonJS
                // 所以经过 babel-loader 处理后的代码默认仍然是 ES Modules
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ // 预设插件集合
                            [
                                '@babel/preset-env', // 所使用的 preset 的名称
                                // 给这个 preset 定义的配置对象
                                { 
                                    // 强制开启 ES Modules 转换插件, 把代码中的 ES Modules 转换为 CommonJS
                                    // Tree-shaking 就会失效
                                    // 默认这个属性是 auto, 根据环境判断是否开启转换插件, false关闭
                                    // modules: 'commonjs' 
                                } 
                            ]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // 用于生成index.html
        // 每个对象负责一个页面的生成
        new HtmlWebpackPlugin({
            title: 'webpack demo',
            // meta: {
            //     viewport: 'width=device-width'
            // },
            template: './src/index.html' //指定所使用的模板
        }),
        // 用于生成about.html
        new HtmlWebpackPlugin({
            filename: 'about.html' //指定输出文件名.默认为index.html
        }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { 
        //             from: 'public' // 需要拷贝的, 可以是通配符, 可以是相对路径
        //         }
        //     ]
        // }),
        // 自定义插件,格式化打包后的注释
        new RemoveCommentsPlugin(),
        // 热更新
        // new webpack.HotModuleReplacementPlugin()
    ],
    // 专门为 webpack dev server 提供配置
    devServer: {
        // 没有参加打包的静态资源文件,也需作为开发服务器的资源被访问,字符串\数组
        // 如 http://localhost:8080/favicon.ico
        // copy-webpack-plugin 留在上线前那一次使用,开发中会频繁重复打包,如这个目录下需拷贝的文件较多,每次都需执行这个插件,打包过程开销较大,每次构建速度降低.
        contentBase: 'public',
        // 代理
        proxy: {
            '/api': {
                target: 'https://api.github.com',
                // 代理路径重写
                pathRewrite: {
                    '^/api': '' // 替换掉代理地址中的 /api
                },
                changeOrigin: true // 以实际代理请求地址中的主机名去请求
            }
        },
        // 热更新: 热更新失败自动刷新
        // hot: true,
        // hotOnly: 无论是否处理了这个代码模块的热替换逻辑，浏览器都不会自动刷新了
        // hotOnly: true
    },
    // 配置开发过程中的辅助工具
    // dist目录中会生成.map文件
    // bundle.js末尾会通过注释引入这个map文件
    devtool: 'source-map',
    // devtool: 'eval',

    // 内置优化功能
    optimization: {
        // 除生产模式下, 默认全部导出
        // 1. 开启后, 模块只导出被使用的成员,未使用的不会被导出
        // 未使用代码还会存在,只是未被导出
        usedExports: true,

        // 2. 开启后, 压缩打包结果, 可以自动压缩掉这些没有用到的代码
        // minimize: true,

        // 尽可能将所有模块合并到一起输出到一个函数
        // 提升了运行效率，又减少了代码的体积
        // concatenateModules: true,

        // production 模式下同样会自动开启
        // 1. 内置优化开启这个功能
        // 2. package.json 中的 sideEffects:false 用来标识我们的代码没有副作用
        sideEffects: true
    }
}
module.exports = config
