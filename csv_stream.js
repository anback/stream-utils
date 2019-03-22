let marketMics = {}
let moment = require('moment')
let fs = require('fs')
var csv = require('csv-stream')
var request = require('request');

module.exports = (filename, options, cb) => {
    var csvStream = fs.createReadStream(filename)
        .pipe(csv.createStream(options))
        .on('data', cb)
    
    return new Promise((resolve, reject) => {
        csvStream.on('end', resolve)
        csvStream.on('error', reject)
    }) 
}