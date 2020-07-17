// ./src/index.js
import './main.css'
import createHeading from './heading.js'
import about from './about.md'

const heading = createHeading()
document.body.append(heading)
console.log('App starts running~');
console.log('about', about)

