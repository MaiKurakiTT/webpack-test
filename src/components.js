export const Button = () => {
    return document.createElement('button')
    console.log('dead-code') // 永远不会被执行,属于未引用代码
}
// 未引用代码
export const Link = () => {
    return document.createElement('a')
}
// 未引用代码
export const Heading = level => {
    return document.createElement('h' + level)
}