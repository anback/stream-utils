
var fs        = require('fs')
  , path      = require('path')
  , XmlStream = require('xml-stream')
  ;

// Create a file stream and pass it to XmlStream
var stream = fs.createReadStream(path.join(__dirname, '1.xml'));
var xml = new XmlStream(stream);

// xml.preserve('item', true);
xml.on('text: Issr', function(item) { console.log('Issr', item) });
xml.on('text: TradgVnRltdAttrbts Id', function(item) { console.log('TradgVnRltdAttrbts', item) });
xml.on('text: FinInstrmGnlAttrbts Id', function(item) { console.log('FinInstrmGnlAttrbts', item) });
