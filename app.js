import express from 'express'
import bodyParser from 'body-parser'
import * as h from './queries.js'
import { cookieMiddle } from './cookieMiddle.js'
import path from 'path'


const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


app.use(cookieMiddle)
app.use(bodyParser.urlencoded({ extended: true }))

app.get(
  '/', (req, res) => res.redirect(301, '/login'))

app.get(
  '/login', (req, res) => {
    if (req.session) res.redirect(302, '/home')
    res.render('logIn')
  })
app.post(
  '/login', (req, res) => {
    h.getUser(req.body)
      .then(h.makeSession)
      .then(sessArray => {req.session = sessArray})
      .then(() => res.redirect(302, '/home'))
      .catch((err) => res.render('logIn', err))
})
app.get(
  '/logout', (req, res) => {
    h.killSession(req.session)
      .then(() => {req.session = undefined; res.redirect(302, '/home')})
      .catch(err => {console.log('logout:err', err);res.redirect(302, '/home')})
})
app.get(
  '/signup', (req, res) => {
    if (req.session) res.redirect(302, '/home')
    res.render('signUp',{signUp:true})
  })
app.post(
  '/signup', (req, res) => {
    h.makeUser(req.body)
      .then(h.makeSession)
      .then(sessArray => {req.session = sessArray})
      .then(() => res.redirect(302, '/home'))
      .catch((err) => res.render('signUp', err))
})
app.get(
  '/home', (req, res) => {
    if (!req.session) {
      res.redirect(302, '/login')
    } else {
      res.render('home', req.session[1])
    }
})
app.post(
  '/home', (req, res) => {
    h.makeHistory(req)
      .then(console.log)
      // .then(sessArray => {req.session = sessArray})
      // .then(() => res.redirect(302, '/home'))
      // .catch((err) => res.render('signup', err))
})
app.get(
  '/history', (req, res) => {
    h.getHistory(req).then((histArray) => {res.json(histArray)}).catch(console.log)
})
app.delete(
  '/history', (req, res) => {
    h.killHistory(req).then(res.send).catch(console.log)
})

app.listen(3000)
