// Imports
const passport = require('passport')
const express = require('express')
// The `LocalStrategy` means that you will handle user profile database
// yourself (as opposed to OAuth, etc. which is based on 3rd-party identity
// providers)
const LocalStrategy = require('passport-local').Strategy

// Here we simply things by saving all users in a dictionary, and you know
// in production you do not want to do this because once server restarts
// all your users' profiles are lost
const allUsersStore = {}

// This tells passport what is the user, given the username and passport.
// In real case you might want to look up a database table (SQL or Mongo, e.g.)
passport.use(new LocalStrategy((username, password, done) => {
  const user = allUsersStore[username]
  if (user && user.password === password) {
    return done(null, user)
  } else {
    return done(null, false, {
      message: '用户名或者密码不对'
    })
  }
}))

// This is *user in memory* -> *user in session store*, if you do not want to
// save all profile info in session store, you can pick some fields and then
// in deserializer (see below) you can populate them back, e.g. from database.
passport.serializeUser((user, done) => {
  done(null, user)
})

// This is *user in session store* -> *user in memory*
passport.deserializeUser((user, done) => {
  done(null, user)
})

const router = express.Router()

// Signing-up is:
// - validate user info
// - save to database
// - (optinally but a good practise to) login the user that just signed-up
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  if (!(username && password)) {
    // invalid input
    return res.sendStatus(400)
  } else if (allUsersStore[username]) {
    // user already exists
    res.sendStatus(400)
  } else {
    allUsersStore[username] = { username, password }
    req.login({ username, password }, err => {
      if (err) {
        next(err)
      } else {
        res.redirect('/')
      }
    })
  }
})

// Here `passport.authenticate` will handle session population for you
// i.e. `req.user` will be populated here
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: '你登录失败了',
  successFlash: '你登录成功了'
}))

// Logging out is a simple as calling `.logout` on `req`
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
