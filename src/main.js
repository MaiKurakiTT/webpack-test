// ./src/index.js
import './main.css'
import createHeading from './heading.js'
import about from './about.md'
import createEditor from './editor.js'
// import createLogo from './logo.png'

const heading = createHeading()
document.body.append(heading)
console.log('App starts running~');
console.log('about', about)


// 全局的 module 对象中的 hot 成员, 就是 HMR API 的核心对象
// accept 方法，用于注册当某个模块更新后的处理函数
// 参数1: 所监视的依赖模块路径 
// 参数2: 依赖模块更新后的处理函数
const editor = createEditor();
document.body.appendChild(editor)
let lastEditor = editor
if (module.hot) {
    module.hot.accept('./editor.js', () => {
        console.log('editor 更新了～～11')
        // div + contentEditable为true  等于一个编辑器
        // 由于热替换把之前的编辑器元素移除了, 替换成一个新元素, 编辑器里的内容会丢失
        const value = lastEditor.innerHTML // 获取之前编辑器的内容
        document.body.removeChild(lastEditor) // 移除旧编辑器
        lastEditor = createEditor() // 重新赋值
        lastEditor.innerHTML = value // 还原编辑器内容
        document.body.appendChild(lastEditor) // 替换成新的
    
        // hot: 处理函数中有错误，结果也会导致自动刷新
        // HMR 过程报错导致 HMR 失败，HMR 失败过后自动刷新，控制台的错误信息被清除
        // hotOnly: 可以看见热替换逻辑中的错误信息
        undefined.foo()
    
        // 未开启HMR功能时: Cannot read property 'accept' of undefined
        // module.hot 是 HMR 插件提供的成员
        // if (module.hot) 确保有 HMR API 对象

        // 移除热更新后重新打包,处理热替换的代码被移除掉了，不会对生产环境有任何影响

        // 因为大部分框架都有成熟的 HMR 方案
    
    })
}


// 图片热替换
// const mLogo = createLogo();
// document.body.appendChild(mLogo)
// module.hot.accept('./logo.png', () => {
//     console.log('图片更新了');
//     // 当 icon.png 更新后执行
//     // 重写设置 src 会触发图片元素重新加载，从而局部更新图片
//     // img.src = logo
// })


// Tree Shaking
import { Button } from './components'
document.body.appendChild(Button())

// sideEffects
// 只希望载入 Button1 模块，实际上载入的是 com/index.js
// index.js 中载入了这个目录中全部的模块，导致所有组件模块被加载执行
import { Button1 } from './com'
document.body.appendChild(Button1())
// 开启useExports 未使用的不会被导出
// 由于模块中有副作用代码,并不会被完全移除
// Tree-shaking 只能移除没有用到的代码成员
// sideEffects 完整移除没有用到的模块

import './extend' // 内部包含影响全局的副作用
console.log((8).pad(3)) // => '0008'
// 对全局有影响的副作用代码不能移除，
// 对模块有影响的副作用代码可以移除。
// package.json  使用通配符, 标识需要保留副作用的模块路径
//   "sideEffects": [
//     "./src/extend.js",
//     "*.css"
//   ]
// "sideEffects": false //全部都没副作用