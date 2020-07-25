// ./src/heading.js
export default () => {
    const element = document.createElement('h2')
    element.textContent = 'Hello1777'
    element.addEventListener('click', () => alert('Hello webpack'))
    return element
}
  