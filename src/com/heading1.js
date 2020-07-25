console.log('Heading component~') // 副作用代码

export const Heading1 = level => {
    return document.createElement('h' + level)
}