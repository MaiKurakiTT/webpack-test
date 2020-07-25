// ./src/extend.js
// 基于原型的扩展方法, 为 Number 的原型添加一个扩展方法, 并没有导出任何成员
// 仅仅是在 Number 的原型上挂载了一个 pad 方法，用来为数字添加前面的导零
Number.prototype.pad = function (size) {
    const leadingZeros = Array(size + 1).join(0)
    return leadingZeros + this
}