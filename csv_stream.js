let marketMics = {}
let moment = require('moment')
let fs = require('fs')
var csv = require('csv-stream')
var request = require('request');

module.exports = (filename, options) => {
    var csvStream = csv.createStream(options);
    return fs.createReadStream(filename)
        .pipe(csvStream)
        .on('error',function(err){
            console.error(err);
        })
}