// import { fileURLToPath } from 'url'
// console.log(import.meta.url)
// const dirname = fileURLToPath(import.meta.url)
// console.log(dirname)
// console.log(process.env)
import qs from 'qs'

const queryStr = qs.stringify({ sort_by: [{ a: 'DESC' }, { b: 'DESC' }] })
console.log(queryStr)
console.log(qs.parse(queryStr))
