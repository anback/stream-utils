var fs        = require('fs')
  , path      = require('path')
  , XmlStream = require('xml-stream')

module.exports = (fileName, selctor, cb) => {
    var stream = fs.createReadStream(path.join(__dirname, fileName));
    var xml = new XmlStream(stream);

    xml.on(`updateElement: ${selctor}`, cb)

    return new Promise((resolve, reject) => {
        xml.on('error', reject)
        xml.on('end', resolve)
    })
}