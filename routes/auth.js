let passport = require('passport')
let express = require('express')
let router = express.Router()

router.get('/isLoggedIn', (req, res) => {
  if (req.user) {
    res.json(true)
  } else {
    res.json(false)
  }
})

router.post('/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    res.sendStatus(req.user ? 200 : 401)
  }
)

router.post('/local',
  passport.authenticate('local'),
  function (req, res) {
    res.sendStatus(req.user ? 200 : 401)
  }
)

router.post('/logout', (req, res) => {
  req.logout()
  res.sendStatus(req.user ? 401 : 200)
})

router.get('/user', (req, res) => {
  if (req.user) {
    req.user.password = undefined
  }
  res.json({ user: req.user })
})

module.exports = router
