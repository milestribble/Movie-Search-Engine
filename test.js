import { except, assert } from 'chai'
import chai from 'chai'
import fs from 'fs'
import chaiHttp from 'chai-http'
import { exec } from 'child_process'
import * as queries from './queries'
chai.use(chaiHttp)

const url = `http://localhost:8080`

describe('Queries.js Unit Tests:', function (){
  beforeEach(function (done) {
    exec(`psql moviesearch_test < ./testschema.sql`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);

        return;
      }
      // console.log(`exec log: ${stdout}`);
      done()

    });
  })
  describe('makeUser():', function (){
    it('Rejects an already in-use e-mail', function (done){
      queries.makeUser({first:'A', last:'B', email:'jimmys@thedailyshow.com', password:'ap', confirm:'ap'})
        .then(() => {
          throw new Error(`Expected to reject used e-mail:1`)
        })
        .catch(err => {
          if (err!=='usedEmail'){
            throw new Error(`Expected to reject used e-mail:2`)
          } else {
            done()
          }
        })
    })
    it('Rejects on unmatched passwords', function (done){
      queries.makeUser({first:'A', last:'B', email:'a@b.com', password:'ap', confirm:'bz'})
        .then(() => {
          throw new Error(`Expected to reject unmatched passwords:1`)
        })
        .catch(err => {
          if (err!=='unmatched'){
            throw new Error(`Expected to reject unmatched passwords:2`)
          } else {
            done()
          }
        })
    })
    it('Returns a User Object', function (done){
      queries.makeUser({first:'A', last:'B', email:'a@b.com', password:'ap', confirm:'ap'})
        .then(result => {
          if (result.hasOwnProperty('self') && result.email === 'a@b.com'
           && result.first === 'A' && result.last === 'B') {
            done()
          } else {
            throw new Error(`Doesn't appear to the a user object: ` + JSON.stringify(result))
          }})
        .catch(err => {throw new Error(`Expected to return a user object`+err)})
    })
  })
  describe('getUser():', function (){
    it('Rejects an unenrolled e-mail', function (done){
      queries.getUser({email:'p@b.com', password:'al'})
        .then(() => { throw new Error(`Expected to reject an unenrolled e-mail:1`) })
        .catch(err => {
          if (err!=='unusedEmail'){
          throw new Error(`Expected to reject an unenrolled e-mail:2`)
        } else {
          done()
        }
      })
    })
    it('Rejects on wrong password', function (done){
      queries.getUser({email:'jimmys@thedailyshow.com', password:'wrong'})
        .then(() => { throw new Error(`Expected to reject a wrong password:1`) })
        .catch(err => {
          if (err!=='unmatchedPassword'){
          throw new Error(`Expected to reject a wrong password:2`)
        } else {
          done()
        }
      })
    })
    it('Returns a User Object', function (done){
      queries.getUser({email:'jimmys@thedailyshow.com', password:'ap'})
        .then(result => {
          if (result.hasOwnProperty('self') && result.hasOwnProperty('email')
           && result.hasOwnProperty('first') && result.hasOwnProperty('last')) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a user object: ` + JSON.stringify(result))
          }})
        .catch(err => {throw new Error(`Expected to return a user object`+err)})
    })
  })
  describe('makeSession():', function (){
    it('Rejects an improper user object', function (done){
      let user = {}
      queries.makeSession(user)
        .then(() => { throw new Error(`Expected to reject an improper user object:1`) })
        .catch(err => {
          if (err!=='improperUserObject'){
            throw new Error(`Expected to reject an improper user object:2`+err)
          } else {
            done()
          }
        })
    })
    it('Returns a Session Array', function (done){
      let user = {self: 1, first: 'James', last: 'Stewart', email: 'jimmys@thedailyshow.com'}
      queries.makeSession(user)
        .then(session => {
          if (session[1].self === 1 && session[1].hasOwnProperty('email')
           && session[1].hasOwnProperty('first') && session[1].last === "Stewart"
           && !isNaN(session[0])) {
            done()
          } else {
            throw new Error(`Doesn't appear to the a proper session array: ` + JSON.stringify(session))
          }})
        .catch(err => {throw new Error(`Expected to return a session array`+err)})
    })
  })
  describe('getSession():', function (){
    it('Rejects an improper session object', function (done){
      queries.getSession(32)
        .then(() => { throw new Error(`Expected to reject an improper session object:1`) })
        .catch(err => {
          if (err!=='get:improperSessObject'){
            throw new Error(`Expected to reject an improper session object:2`)
          } else {
            done()
          }
        })
    })
    it('Rejects on unfound session', function (done){
      queries.getSession('72')
        .then(() => { throw new Error(`Expected to reject on an unfound session`) })
        .catch(err => {
          if (err!=='unfoundSession'){
          throw new Error(`Expected to reject on an unfound session`)}
        done()}
      )
    })
    it('Returns a Session Array', function (done){
      queries.getSession('1')
        .then(session => {
          if (session[1].self === 1  && session[1].hasOwnProperty('email')
           && session[1].hasOwnProperty('first') && session[1].last === 'Stewart'
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
      queries.killSession(48)
        .then(() => { throw new Error(`Expected to reject an improper session object:1`) })
        .catch(err => {
          if (err!=='kill:improperSessObject'){
            throw new Error(`Expected to reject an improper session object:2`)
          } else {
            done()
          }
        })
    })
    it('Rejects on unfound session', function (done){
      queries.killSession('65')
        .then(() => { throw new Error(`Expected to reject on an unfound session:1`) })
        .catch(err => {
          if (err!=='unfoundSession'){
            throw new Error(`Expected to reject on an unfound session:2`+err)
          } else {
            done()
          }
        })
    })
    it('Returns a confirmation on success', function (done){
      queries.killSession('1')
        .then(result => {
        if (result === 'killedSession') {
          done ()
        } else {
          throw new Error(`Doesn't appear to have succesfully deleted: ` + JSON.stringify(result))
        }})
        .catch(err => {throw new Error(`Doesn't appear to have succesfully deleted.`+err)})
    })
  })
  describe('makeHistory():', function (){
    const req = {body:{query:'Treasure Island'}, session:['1',{self: '1', first: 'James', last: 'Stewart', email: 'jimmys@thedailyshow.com'}]}
    it('Rejects an improper search string', function (done){
      let thisReq = Object.assign({}, req, {body:{query:undefined}})
      queries.makeHistory(thisReq)
        .then(() => { throw new Error(`Expected to reject the improper search string:1`) })
        .catch(err => {
          if (err!=='improperSearchString'){
          throw new Error(`Expected to reject the improper search string:2`)
        } else {
          done()
        }})
    })
    it('Rejects on improper req.session', function (done){
      let thisReq = Object.assign({}, req, {session:undefined})
      queries.makeHistory(thisReq)
        .then(() => { throw new Error(`Expected to reject on an improper req.session:1`) })
        .catch(err => {
          if (err!=='noUser4History'){
          throw new Error(`Expected to reject on an improper req.session:2`+err)}
        done()}
      )
    })
    it('Returns a confirmation on success', function (done){
      queries.makeHistory(req)
        .then(result => {
        if (result === 'madeHistory') {
          done ()
        } else {
          throw new Error(`Doesn't appear to have succesfully recorded: ` + JSON.stringify(result))
        }})
        .catch(err => {throw new Error(`Doesn't appear to have succesfully recorded.`+err)})
    })
  })
  describe('getHistory():', function (){
    const req = {session:['1',{self: '1', first: 'James', last: 'Stewart', email: 'jimmys@thedailyshow.com'}]}
    it('Rejects on improper req.session', function (done){
      let thisReq = Object.assign({}, req, {session:undefined})
      queries.getHistory(thisReq)
        .then(() => { throw new Error(`Expected to reject on an improper req.session:1`) })
        .catch(err => {
          if (err!=='noUser4History'){
          throw new Error(`Expected to reject on an improper req.session:2`+err)}
        done()}
      )
    })
    it('Returns a History Array', function (done){
      queries.getHistory(req)
        .then(history => {
          if (history instanceof Array && typeof(history[0]) === 'string') {
            done()
          } else {
            throw new Error(`Doesn't appear to the a proper History array: ` + JSON.stringify(history))
          }})
        .catch(err => {throw new Error(`Expected to return a proper History array`+err)})
    })
  })
  describe('killHistory():', function (){
    const req = {session:['1',{self: '1', first: 'James', last: 'Stewart', email: 'jimmys@thedailyshow.com'}]}
    it('Rejects on improper req.session', function (done){
      let thisReq = Object.assign({}, req, {session:undefined})
      queries.killHistory(thisReq)
        .then(() => { throw new Error(`Expected to reject on an improper req.session:1`) })
        .catch(err => {
          if (err!=='noUser4History'){
          throw new Error(`Expected to reject on an improper req.session:2`+err)}
        done()}
      )
    })
    it('Returns a Confirmation', function (done){
      queries.killHistory(req)
        .then(result => {
          if (result === 'killedHistory') {
            done ()
          } else {
            throw new Error(`Doesn't appear to have succesfully killedHistory: ` + JSON.stringify(result))
          }})
          .catch(err => {throw new Error(`Doesn't appear to have succesfully killedHistory.`+err)})
    })
  })
})

describe('Integration Tests:', function (){
  describe('Signing Up', function (){
    describe('Erroneous Data', function (){
      it('Returns sign up page with used email alert', function (done){

      })
      it('Returns sign up page with unmatched password alert', function (done){

      })
    })
    describe('Proper Data', function (){
      it('Returns home page with first name', function (){

      })
      it('Returns sessionCookie', function (){

      })
    })
  })
  describe('Signing In', function (){
    describe('Erroneous Data', function (){
      it('Returns sign in page with unmatched login alert', function (done){

      })
    })
    describe('Proper Data', function (){
      it('Returns home page with first name', function (){

      })
      it('Returns sessionCookie', function (){

      })
    })
  })
  describe('Signing Out', function (){
    it('Returns sign up page', function (done){

    })
    it('Does not return sessionCookie', function (done){

    })
  })




  describe('Resuming a Session', function (){
    it('Fails when given a used email', function (done){
      pgtest.expect('SELECT * FROM vegetables WHERE self = $1',[1]).returning(null, [
          [ 'potatoes', '1kg' ],
          [ 'tomatoes', '500g' ]
      ]);
      // chai.request(url)
      //   .post('/signup')
      //   .end(function(err, res) {
      //     expect(res).to.have.status(200);
      //     done()
      //   })
      queries.query('SELECT * FROM vegetables WHERE self = $1', [1])
      pgtest.check();
      done()
    })
    it('Rejects when given unmatched passwords', function (){
      chai.request(url)
        .post('/signup')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done()
        })
    })
    it('Resolves when given proper data', function (){
      chai.request(url)
        .post('/signup')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done()
        })
    })
  })
  describe('Ending a Session', function (){
    it('', function () {

    })
  })
  describe('Recording History', function (){

  })
  describe('Clearing History', function (){

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
