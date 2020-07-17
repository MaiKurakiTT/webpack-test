const path = require('path') //nodejs内置模块
// 导入 Webpack 配置对象的类型, 为了标注 config 对象的类型
// 配置完成后注释掉,nodejs环境不支持import
// import { Configuration } from 'webpack'
// 或者在注释中导入
/** @type {import('webpack').Configuration} */

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') //默认导出的就是插件类型，不需要再解构内部成员
const CopyWebpackPlugin = require('copy-webpack-plugin')
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
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: 'public' // 需要拷贝的, 可以是通配符, 可以是相对路径
                }
            ]
        }),
        new RemoveCommentsPlugin()
    ]
}
module.exports = config
