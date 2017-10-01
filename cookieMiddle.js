
import {getSession} from './queries.js'
import onHeaders from 'on-headers'
import cookie from 'cookie'

export function cookieMiddle (req, res, next) {
  req.cookies = typeof req.headers.cookie === 'string'
    ? cookie.parse(req.headers.cookie)
    : undefined
  let sessionId = req.cookies
    ? req.cookies.sessionCookie
    : undefined
  if (sessionId) {
    getSession(sessionId)
      .then((session) => {
        session ? req.session = session : req.session = undefined
        next()
      })
      .catch(err => res.render('logIn'))
  } else { next() }
  onHeaders(res, function () {
    if (req.session) {
      res.cookie('sessionCookie', req.session[0])
    } else {
      res.clearCookie('sessionCookie')
    }
  })
}
