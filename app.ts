import createError from 'http-errors'
import express, { ErrorRequestHandler } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes/index.ts'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import conifg from './config/index.ts'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(fileURLToPath(import.meta.url), 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
} as ErrorRequestHandler)

const connection = await mysql.createConnection(conifg.mysql)

connection.connect()
const [rows, fields] = await connection.execute('SELECT * FROM STORE')
console.log('rows', rows)
console.log('fields', fields)

export default app
