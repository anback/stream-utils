//@flow
let assert = require('assert')
let idx = require('idx')
let csvStream = require('./csv_stream')
let xml2js = require('./xml2js')
let mics = {}
let firds = {}
let res = {}
let keys = new Set()
let onNewIsoMic = mic => mics[mic.MIC] = mic
let onNewFirdsInstrument = data => {
    try {
        // console.log(JSON.stringify(data, undefined, 2))
    let isin = idx(data, data => data.DerivInstrmAttrbts.UndrlygInstrm.Bskt.ISIN) || idx(data, data => data.DerivInstrmAttrbts.UndrlygInstrm.Sngl.ISIN)
    if(!isin) return
    if(!firds[isin]) firds[isin] = []
    if(!firds[isin].map(d => d.TradgVnRltdAttrbts.Id).includes(data.TradgVnRltdAttrbts.Id))
    firds[isin].push(data)
    // Object.keys(data.TradgVnRltdAttrbts).forEach(key => keys.add(key))
    }
    catch (e) {console.log(data); console.error(e)} 

}

const groupBy = (key, arr) =>
    arr.reduce(function(groups, item) {
        var val = item[key];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});

csvStream('ISO10383_MIC.csv', undefined, onNewIsoMic)
.then(() => xml2js('2.xml', 'RefData', onNewFirdsInstrument))
.then(() => showRes)
.then(process.exit)
.catch(e => console.error('error', e))   

let showRes = () => {
    Object.keys(firds)
    .map(isin => ({isin, firdsElements: firds[isin]}))
    .map(({isin, firdsElements}) => {
        let segmentMics = firdsElements.map(firdElement => firdElement.TradgVnRltdAttrbts.Id).map(mic => mics[mic]).filter(mic => !!mic)
        let segmentMicsObj = groupBy('OPERATING MIC', segmentMics)
        let badMicSets = Object.keys(segmentMicsObj).filter(key => segmentMicsObj[key].filter(mic => mic.MIC !== key).length > 1).map(key => ({operatingMic: key, segmentMics: segmentMicsObj[key].reduce((a,b) => a.concat(b.MIC), [])}))
        let isBadInstr = badMicSets.length > 0
        return {isBadInstr, isin, badMicsObj: badMicSets[0]}
    })
    // .filter(({isBadInstr}) => isBadInstr)
    .map(({isBadInstr, isin, badMicsObj}) => {
        if(!isBadInstr) return
        let key = `${badMicsObj.operatingMic}_${badMicsObj.segmentMics.join('_')}`
        res[key] = badMicsObj
    })
    console.log('********************************************************************')
    Object.keys(res).forEach(key => {
        console.log(`operating Mic: ${key.split('_')[0]}, segment Mic: ${key.split('_').filter((x,i) => i > 0).join(',')}`)
    })
}

setInterval(showRes, 1000)

/*
operating Mic: ITGL, segment Mic: XPAC,XPOS
operating Mic: XIEL, segment Mic: BLOX,BRFQ
operating Mic: XDUS, segment Mic: DUSB,DUSD
operating Mic: TRQX, segment Mic: TRQA,TRQM,TRQX
operating Mic: XMUN, segment Mic: MUNB,MUND
operating Mic: XDUS, segment Mic: DUSD,DUSB
operating Mic: TGAT, segment Mic: XGAT,XGRM
operating Mic: XHAM, segment Mic: HAMB,HAMN
operating Mic: BCXE, segment Mic: BATD,BATE,BATF,BATP,CHID,CHIO,CHIX,LISX
operating Mic: XSTO, segment Mic: DNSE,FNSE,MNSE
operating Mic: ITGL, segment Mic: XPOS,XPAC
operating Mic: XFRA, segment Mic: FRAA,FRAB
operating Mic: XFRA, segment Mic: FRAB,FRAA
operating Mic: XSTU, segment Mic: STUB,STUA
operating Mic: XSTU, segment Mic: STUA,STUB
*/