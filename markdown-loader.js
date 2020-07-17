// 每个 Webpack 的 Loader 都需要导出一个函数
// 函数为 Loader 对资源的处理过程

// 方法二: 导入这个模块,去解析source
const marked = require('marked')

// source 接收输入的内容 
module.exports = source => {
    // 2.1. 将 markdown 转换为 html 字符串
    const html = marked(source)
    // 2.2. 将 html 字符串拼接为一段导出字符串的 JS 代码
    //    JSON.stringify() 将字符串转换为标准的 JSON 字符串
    const code = `module.exports = ${JSON.stringify(html)}`
    // Webpack 内部会自动转换 ES Modules 代码
    // // const code = `export default ${JSON.stringify(html)}`
    return code

    // 方法三: 直接返回 HTML 字符串，然后交给下一个 Loader 处理
    // 再安装一个处理html的 'html-loader'
    // return html;

    // 返回值输出 就是最终被打包的内容
    // 方法一: 最终返回一段js代码字符串
    // return 'console.log("hello loader ~")'
}