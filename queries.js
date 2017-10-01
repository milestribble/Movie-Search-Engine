import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import Cryptr from 'cryptr'
const cryptr = new Cryptr(require('./private/secrets'))

const connectionString = process.env.NODE_ENV === 'test'
  ? 'postresql://localhost:5432/moviesearch_test'
  : 'postresql://localhost:5432/moviesearch'
const pool = new Pool({connectionString})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export function query (statement, params) {
  return new Promise(function (resolve, reject) {
    pool.connect()
      .then(client => {
        client.query(statement, params)
        .then(res => { client.release(); resolve(res) })
        .catch(e => { client.release(); reject(e) })
      })
  })
}

export function makeUser (req) {
  return new Promise( (resolve, reject) => {
    const checkForExisting  = (form) =>
      new Promise ( (resolve, reject) => {
        query('SELECT * FROM users WHERE email = $1', [form.email])
          .then(result =>
            result.rows[0]
              ? form.email == result.rows[0].email
                ? reject('usedEmail')
                : reject('Well, how did we get here! re:makeUser ')
              : resolve(form))
    })
    const hashPassword = (form) =>
      new Promise ( (resolve, reject) => {
        if (form.password !== form.confirm) reject('unmatched')
        bcrypt.hash(form.password, 10, (err, hash) => {
          if (err) {reject('couldnt salt the steak')}
          delete form.confirm
          form.password = hash
          resolve(form)
        })
    })
    const makeUser = (form) =>
      new Promise ( (resolve, reject) => {
        query(`INSERT INTO users (first, last, email, password)
          VALUES ($1, $2, $3, $4)
          RETURNING self, first, last, email`,
          [form.first, form.last, form.email, form.password])
          .then(res => resolve(res.rows[0]))
    })

    checkForExisting(req).then(hashPassword).then(makeUser).then(resolve).catch(reject)
  })
}

export function getUser (req) {
  return new Promise( function(resolve, reject) {

    const checkForExisting  = (form) =>
      new Promise ( (resolve, reject) => {
        query('SELECT * FROM users WHERE email = $1', [form.email])
          .then(result =>
            result.rows[0]
              ? resolve([form, result.rows[0]])
              : reject('unusedEmail'))
    })
    const comparePassword = (hashUserCombo) =>
      new Promise ( (resolve, reject) => {
        let hash = hashUserCombo[1].password
        delete hashUserCombo[1].password
        bcrypt.compare(hashUserCombo[0].password, hash)
          .then(bool => bool ? resolve(hashUserCombo[1]) : reject('unmatchedPassword') )
    })

    checkForExisting(req).then(comparePassword).then(resolve).catch(reject)
  })
}

export function makeSession (user) {
  return new Promise(function (resolve, reject) {
    const confirmUserObject = (user) =>
      new Promise((resolve, reject) =>
        user.hasOwnProperty('self') ? resolve(user) : reject('improperUserObject')
    )
    const makeSession = (user) =>
      new Promise((resolve, reject) =>
        query('INSERT INTO sessions (userId) VALUES ($1) RETURNING self', [user.self])
          .then(result => resolve([cryptr.encrypt(result.rows[0].self),user]))
    )

    confirmUserObject(user).then(makeSession).then(resolve).catch(reject)
  })
}

export function getSession (sessionId) {
  return new Promise( function(resolve, reject) {
    sessionId  = cryptr.decrypt(sessionId)
    if (typeof(sessionId) !== 'string' || isNaN(sessionId)) {
      reject('get:improperSessObject')
    } else {
      query(`SELECT self, first, last, email FROM users
      WHERE self = (SELECT userId FROM sessions WHERE self = $1)`, [sessionId])
        .then(result => {
          if (result.rows[0] === undefined ) reject('unfoundSession')
          resolve([cryptr.encrypt(sessionId),result.rows[0]])
        })
    }
  })
}

export function killSession (session) {
  return new Promise( function(resolve, reject) {
    typeof session[0] !== 'string' ? reject('kill:improperSessObject') : undefined
    session = cryptr.decrypt(session[0])
    if ( (typeof session !== 'string' && !isNaN(session) )
       || typeof session === 'undefined' ){
      reject('kill:improperSessObject')
    } else {
      query('DELETE FROM sessions WHERE self = $1', [session])
        .then(result => result.rowCount === 1
          ? resolve('killedSession')
          : reject('unfoundSession'))
        .catch((err) => reject('killSess-queryError'+err))
    }
  })
}

export function makeHistory (req) {
  return new Promise( function(resolve, reject) {
    const confirmSession = (req) =>
      new Promise((resolve, reject) =>
        req.session
          ? isNaN(req.session[1].self) ? reject('noUser4History') : resolve(req)
          : reject('noUser4History')
    )
    const validateQuery = (req) =>
      new Promise((resolve, reject) =>
        typeof(req.body.query) === 'string'
          ? resolve(req)
          : reject('improperSearchString')
    )
    const makeHistory = (req) =>
      new Promise((resolve, reject) =>
        query(`INSERT INTO history (userId, query)
                VALUES ($1, $2)`, [req.session[1].self, req.body.query])
          .then(results => resolve('madeHistory'))
          .catch(reject)
    )

    confirmSession(req).then(validateQuery).then(makeHistory).then(resolve).catch(reject)
  })
}

export function getHistory (req) {
  return new Promise( function(resolve, reject) {
    const confirmSession = (req) =>
      new Promise((resolve, reject) =>
        req.session
          ? isNaN(req.session[1].self) ? reject('invalidUser4History') : resolve(req)
          : reject('noUser4History')
    )
    const getHistory = (req) =>
      new Promise((resolve, reject) =>
        query(`SELECT * FROM history WHERE userId = $1`, [req.session[1].self])
          .then(results => {
            let historyArray = []
            for(let i=0; i<results.rowCount; i++){
              historyArray.push(results.rows[i].query)
            }
            resolve(historyArray)
          })
          .catch(reject)
    )
    confirmSession(req).then(getHistory).then(resolve).catch(reject)
  })
}

export function killHistory (req) {
  return new Promise( function(resolve, reject) {
    const confirmSession = (req) =>
      new Promise((resolve, reject) =>
        req.session
          ? isNaN(req.session[1].self) ? reject('invalidUser4History') : resolve(req)
          : reject('noUser4History')
    )
    const killHistory = (req) =>
      new Promise((resolve, reject) =>
        query(`DELETE FROM history WHERE userId = $1`, [req.session[1].self])
          .then(results => resolve('killedHistory'))
          .catch(reject)
    )
    confirmSession(req).then(killHistory).then(resolve).catch(reject)
  })
}
