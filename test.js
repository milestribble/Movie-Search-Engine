import {except, assert} from 'chai'
import {createUser} from './queries'

describe('Database Queries:', function (){
  describe('Unit - createUser():', function (){
    it('Rejects an already in-use e-mail', function (done){
      createUser()
        .then(done)
        .catch(err => {console.log(err);if (err!=='usedEmail'){console.log('yelp');
          throw new Error(`Expected to reject used e-mail`)}
          done()}
      )
    })
    it('Rejects on unmatched passwords', function (done){
      createUser()
        .then(done)
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
        .catch(err => {throw new Error(`Expected to return a user object`)})
    })
  })  
  describe('Integration: User Creation:', function (){


  })
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
