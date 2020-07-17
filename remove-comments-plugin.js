// 插件必须是一个函数 或 包含apply方法的对象
class RemoveCommentsPlugin {
    constructor() {}
    // apply方法在 Webpack 启动时被调用
    apply (compiler) {
      // compiler 包含此次构建的所有配置信息
      console.log('RemoveCommentsPlugin 启动')
      // emit 钩子，在 Webpack 即将向输出目录输出文件时执行
      // compiler 对象的 hooks 属性访问到 emit 钩子，再通过 tap 方法注册一个钩子函数
      // 参数1:插件名称
      // 参数2:要挂载的函数
      compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation=>{
        // compilation 此次运行打包的上下文, 包含所有打包过程中产生的结果
        // assets 属性获取即将写入资源文件信息, 一个对象, key为文件名称
        for (const name in compilation.assets) {
            console.log('name--', name) // 输出文件名称
            // console.log('source--', compilation.assets[name].source()) // 输出文件内容
            if (name.endsWith('.js')) { // 只需要处理 JS 文件
                const contents = compilation.assets[name].source()
                //   /***** */    \将下一个字符标记为特殊字符
                //   \/ ---- 匹配/
                //   \*{2,} ---- 匹配* 至少匹配2次
                //   \/\s   ---- 匹配/ \s为匹配任何空白字符
                //   ?      ---- 匹配前面的子表达式零次或一次
                const noComments = contents.replace(/\/\*{2,}\/\s?/g, '')
                compilation.assets[name] = {
                  source: () => noComments, // 返回新的内容
                  size: () => noComments.length // 内容的大小
                }
            }
        }
      })
    }
}
module.exports = RemoveCommentsPlugin;
