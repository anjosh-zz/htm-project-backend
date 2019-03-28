const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const httpsRedirect = require('express-https-redirect')

const index = require('./routes/index')
const users = require('./routes/users')
const persons = require('./routes/persons')
const actionTypes = require('./routes/actionTypes')
const relationships = require('./routes/relationships')
const actions = require('./routes/actions')

const auth = require('./routes/auth')
require('./modules/passport')

const app = express()

app.use(cors({
  origin: process.env.ALLOWED_DOMAIN || 'http://localhost:3000',
  credentials: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(httpsRedirect())

app.use('/', index)
app.use('/auth', auth)
app.use('/users', users)
app.use('/persons', persons)
app.use('/actionTypes', actionTypes)
app.use('/relationships', relationships)
app.use('/actions', actions)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) { // do not remove 4th parameter because it causes it to be the error handler
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
