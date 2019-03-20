//@flow
let c = -1
let elements = []
let obj = {}
var fs        = require('fs')
  , path      = require('path')
  , XmlStream = require('xml-stream')
  ;

// Create a file stream and pass it to XmlStream
var stream = fs.createReadStream(path.join(__dirname, '2.xml'));
var xml = new XmlStream(stream);

// xml.preserve('item', true);
xml.on('text: FinInstrmGnlAttrbts Id', function(item) { elements.push({isin: item.$text, mic: '', firstTradeDate: ''}) });
xml.on('text: TradgVnRltdAttrbts Id', function(item) {
    let {$text} = item 
    let lastKey = elements.length - 1
    let lastelement = elements[lastKey]
    elements[lastKey].mic = $text
});

xml.on('text: TradgVnRltdAttrbts FrstTradDt', function(item) {
  let {$text} = item 
  let lastKey = elements.length - 1
  let lastelement = elements[lastKey]
  elements[lastKey].firstTradeDate = $text
  // console.log(JSON.stringify(elements[lastKey]))
  if(c++ % 1000 === 0) console.log(c + ' rows')
});


xml.on('end', () => {
  console.log('end')
  elements.forEach(({isin, mic, firstTradeDate}) => {
    if(!obj[isin]) {obj[isin] = {mics: [{mic, firstTradeDate}]}; return }
    obj[isin].mics.push({mic, firstTradeDate})
  })

  fs.writeFileSync('2.json', JSON.stringify(obj, undefined, 2))
})


/*

Issr { '$': {}, '$name': 'Issr', '$text': '529900VD5LTPRWYYL682' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'MUNB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US15911M1071' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900VD5LTPRWYYL682' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'STUB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US15911M1071' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900VD5LTPRWYYL682' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'XGAT' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'BERB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'DUSD' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'EQLD' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'FRAB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'HAMN' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'MUNB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id', '$text': 'STUB' }
FinInstrmGnlAttrbts { '$': {}, '$name': 'Id', '$text': 'US1630751048' }
Issr { '$': {}, '$name': 'Issr', '$text': '529900JR51JXQWYK5B18' }
TradgVnRltdAttrbts { '$': {}, '$name': 'Id'^C

*/