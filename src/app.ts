import createError from 'http-errors'
import express, { ErrorRequestHandler } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize'
import { initModels, Config } from './models/init-models.ts'

import indexRouter from './routes/index.ts'
import conifg from './config/index.ts'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(fileURLToPath(import.meta.url), 'public')))

app.use('/app', indexRouter)

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

const { database, user, password, host, port } = conifg.mysql
const sequelize = new Sequelize(database, user, password, {
    dialect: 'mysql',
    host,
    port,
})
initModels(sequelize)
const configs = await Config.findAll()
console.log(configs)

// sequelize 사용으로 mysql은 사용하지 않는다.
// const connection = await mysql.createConnection(conifg.mysql)
// connection.connect()
// const [rows, fields] = await connection.execute('SELECT * FROM STORE')

export default app
