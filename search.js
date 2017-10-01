const cheerio = require('cheerio');
const http = require('http');

getIMDB().then( (data)=>cheerioParse(data) ).then( (data)=>printResults(data) ).catch( (err)=>console.log(err) )

function getIMDB () {
  return new Promise(function (resolve, reject) {
    let searchObj = parseURL(process.argv)
    if (searchObj.message == "No Arguments") return searchObj
    let body = "a"
    http.get({
      hostname: searchObj.hostname,
      path: searchObj.path
    }, (res) => {
      res.on('data', function (chunk) {
        body += chunk.toString()
      });
      res.on('end', function () {
        resolve(body)
      })
    });
  })
}

function parseURL (args) {
    try {
      if (!args[2]) throw new Error('No Arguments')
      args = args.slice(2).join(" ")
      let search = args.toLowerCase().split(" ").join("+")
      return {search:args,hostname:'www.imdb.com',path:`/find?ref_=nv_sr_fn&q=${search}&s=all`}
    } catch (e) {
      reject(e)
    }
}

function cheerioParse (body) {
  let $ = cheerio.load(body);
  let results = []
  let table = $('table.findList').each(function (i, elem){
    results[i] = $(this).text()
  });
  results = results[0].split('     ').slice(1)
  results = results.map(function (el) {
    el = el.split('')
    while(true){
      let next = el.shift()
      if (next != ' '){el.unshift(next); break;}
    }
    while(true){
      let next = el.pop()
      if (next != ' '){el.push(next); break;}
    }
    return el.join('')
  })
  return results
}

function printResults(results) {
  results.forEach(function (el){
    console.log(el);
  })
}

module.exports = {parseURL:parseURL, getIMDB:getIMDB}
