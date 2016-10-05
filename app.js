// Imports
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const flash = require('connect-flash')
const auth = require('./auth')

const app = express()

// Logging
app.use(morgan('dev'))

// Parsing `application/x-www-form-urlencoded` body
app.use(bodyParser.urlencoded({ extended: false }))

// Parsing `application/json` body
app.use(bodyParser.json())

// Note that this is in-memory session, to use a persistent one
// see [connect-redis](https://github.com/tj/connect-redis)
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat'
}))

// See [#configure](http://passportjs.org/docs/configure) section
// and also note that passport's session middleware should be after
// `express-session` because it relies on the latter
app.use(passport.initialize())
app.use(passport.session())
// Add flash support or else the `successFlash` and `failureFlash`
// provided by `passport` will not work
app.use(flash())

// Put all auth related routes to a router
// see `auth.js`
app.use('/auth', auth)

app.get('/', (req, res) => {
  res.json({
    hello: 'world'
  })
})

module.exports = app
