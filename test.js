import {except, assert} from 'chai'
import {createUser, getSession, killSession, makeSession, verifyUser} from './queries'

describe('Database Queries - Unit Tests:', function (){
  describe('createUser():', function (){
    it('Rejects an already in-use e-mail', function (done){
      createUser()
        .then(() => { throw new Error(`Expected to reject used e-mail`) })
        .catch(err => {
          if (err!=='usedEmail'){
          throw new Error(`Expected to reject used e-mail`)}
        done()}
      )
    })
    it('Rejects on unmatched passwords', function (done){
      createUser()
        .then(() => { throw new Error(`Expected to reject unmatched passwords`) })
        .catch(err => {
          if (err!=='unmatched'){
          throw new Error(`Expected to reject unmatched passwords`)}
        done()}
      )
    })
    it('Returns a User Object', function (done){
      createUser()
        .then(result => {
          if (result.hasOwnProperty('self') && result.hasOwnProperty('email')
           && result.hasOwnProperty('fname') && result.hasOwnProperty('lname')) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a user object: ` + JSON.stringify(result))
          }})
        .catch(err => {throw new Error(`Expected to return a user object`+err)})
    })
  })
  describe('verifyUser():', function (){
    it('Rejects an unenrolled e-mail', function (done){
      verifyUser()
        .then(() => { throw new Error(`Expected to reject an unenrolled e-mail`) })
        .catch(err => {
          if (err!=='usedEmail'){
          throw new Error(`Expected to reject an unenrolled e-mail`)}
          done()}
      )
    })
    it('Rejects on wrong password', function (done){
      verifyUser()
        .then(() => { throw new Error(`Expected to reject a wrong password`) })
        .catch(err => {
          if (err!=='unmatchedPassword'){
          throw new Error(`Expected to reject a wrong password`)}
        done()}
      )
    })
    it('Returns a User Object', function (done){
      verifyUser()
        .then(result => {
          if (result.hasOwnProperty('self') && result.hasOwnProperty('email')
           && result.hasOwnProperty('fname') && result.hasOwnProperty('lname')) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a user object: ` + JSON.stringify(result))
          }})
        .catch(err => {throw new Error(`Expected to return a user object`+err)})
    })
  })
  describe('getSession():', function (){
    it('Rejects an improper session object', function (done){
      getSession()
        .then(() => { throw new Error(`Expected to reject an improper session object`) })
        .catch(err => {
          if (err!=='improperSessObject'){
          throw new Error(`Expected to reject an improper session object`)}
          done()}
      )
    })
    it('Rejects on unfound session', function (done){
      getSession()
        .then(() => { throw new Error(`Expected to reject on an unfound session`) })
        .catch(err => {
          if (err!=='unfoundSession'){
          throw new Error(`Expected to reject on an unfound session`)}
        done()}
      )
    })
    it('Returns a Session Array', function (done){
      getSession()
        .then(session => {
          if (session[1].hasOwnProperty('self') && session[1].hasOwnProperty('email')
           && session[1].hasOwnProperty('fname') && session[1].hasOwnProperty('lname')
           && !isNaN(session[0])) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a proper session array: ` + JSON.stringify(session))
          }})
        .catch(err => {throw new Error(`Expected to return a session array`+err)})
    })
  })
  describe('makeSession():', function (){
    it('Rejects an improper user object', function (done){
      makeSession()
        .then(() => { throw new Error(`Expected to reject an improper user object`) })
        .catch(err => {
          if (err!=='improperUserObject'){
          throw new Error(`Expected to reject an improper user object`)}
          done()}
      )
    })
    it('Rejects on unfound user', function (done){
      makeSession()
        .then(() => { throw new Error(`Expected to reject on an unfound user`) })
        .catch(err => {
          if (err!=='unfoundUser'){
          throw new Error(`Expected to reject on an unfound user`)}
        done()}
      )
    })
    it('Returns a Session Array', function (done){
      makeSession()
        .then(session => {
          if (session[1].hasOwnProperty('self') && session[1].hasOwnProperty('email')
           && session[1].hasOwnProperty('fname') && session[1].hasOwnProperty('lname')
           && !isNaN(session[0])) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a proper session array: ` + JSON.stringify(session))
          }})
        .catch(err => {throw new Error(`Expected to return a session array`+err)})
    })
  })
  describe('killSession():', function (){
    it('Rejects an improper session object', function (done){
      killSession()
        .then(() => { throw new Error(`Expected to reject an improper session object`) })
        .catch(err => {
          if (err!=='improperSessObject'){
          throw new Error(`Expected to reject an improper session object`)}
          done()}
      )
    })
    it('Rejects on unfound session', function (done){
      killSession()
        .then(() => { throw new Error(`Expected to reject on an unfound session`) })
        .catch(err => {
          if (err!=='unfoundSession'){
          throw new Error(`Expected to reject on an unfound session`)}
        done()}
      )
    })
    it('Returns a confirmation on success', function (done){
      killSession()
        .then(result => {
        if (result === 'deleted') {
          done ()
        } else {
          throw new Error(`Doesn't appear to have succesfully deleted: ` + JSON.stringify(result))
        }})
        .catch(err => {throw new Error(`Doesn't appear to have succesfully deleted.`+err)})
    })
  })
})

describe('Integration: User Creation:', function (){
  describe('User Verification', function (){

  })
  describe('Session Creation', function (){

  })
  describe('Session Verification', function (){

  })
  describe('Session Deletion', function (){

  })
  describe('Record History', function (){

  })
  describe('Clear History', function (){

  })
})

describe('Result Parsing', function (){
  describe('Fetching HTML', function (){

  })
  describe('Cherrio Parsing', function (){

  })
})

describe('Express Routing', function (){
  describe('Fetching HTML', function (){

  })
  describe('Cherrio Parsing', function (){

  })
})
