import { fileURLToPath } from 'url'
console.log(import.meta.url)
const dirname = fileURLToPath(import.meta.url)
console.log(dirname)
console.log(process.env)
