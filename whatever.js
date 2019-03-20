const SEGMENT_MICS = ["TNLA","XAMS","XEUC","XEUE","XEUI","ALXB","MLXB","TNLB","VPXB","XBRD","XBRU","DCSE","DNDK","DSME","FNDK","MCSE","MNDK","XCSE","DHEL","DNFI","FNFI","FSME","MHEL","MNFI","XHEL","DICE","DNIS","FNIS","MICE","MNIS","XICE","ALXL","ENXL","MFOX","OMIP","WQXL","XLIS","FNLT","XLIT","AIMX","XLOD","XLOM","XLON","NMTF","XNDX","XNGM","XNMR","ALDP","AMXO","ARCD","ARCO","ARCX","NYSD","XASE","XCHI","XCIS","XNLI","XNYS","MERD","MERK","NIBR","XOAA","XOAD","XOAM","XOAS","XOSA","XOSC","XOSD","XOSL","ALXP","MTCH","XAPA","XBLK","XETF","XMAT","XMLI","XMON","XPAR","XSPM","FNLV","XRIS","CSTO","DKED","DKFI","DNSE","DOSE","DSTO","EBON","ESTO","EUWB","FIED","FNSE","GBWB","MNSE","MOSE","MSTO","NOCO","NOED","NOFI","ONSE","PNED","SEED","SSME","USWB","XOPV","XSTO","XBTR","XQMH","XSEB","XSLS","XSWM","XSWX","XVTX","FNEE","XTAL","BOSP","PLPD","PLPX","RPWC","TBSP","WBCL","WBON","WDER","WETP","WGAS","WIND","WIPO","WMTF","WOPO","XNCO","XWAR","XBUD","XTND","XPRA","XPRM","XDSM","XEQY","XFNO","XIST","XPMS","TRQA","TRQB","TRQC","TRQM","TRQS","TRQX","XUBS","XUMP","MISX","RTSX","ASXB","ASXC","ASXP","ASXT","ASXV","XASX","XSFE","XSHG","XSSC","XSEC","XSHE","SHSC","SZSC","XGEM","XHKG","BSME","XBOM","INSE","XNSE","MESQ","XKLS","XSBT","XSCA","XSCE","XSES","XSIM","XBKF","XBKK","XMAI","SBIJ","SBIU","SBIV","XSBI","SGMX","SGMY","XTNX","XTSX","LIQF","LIQH","LIQU","HSTC","XHNF","XHNX","CHIA","CXAC","CXAF","CXAM","CXAN","CXAP","CXAQ","CXAR","CXAV","CXAW","CHIJ","CHIS","CHIV","KAIX","PURE","XCNQ","XATL","XDUB","XESM","XEYE","XMSM"]
let csvStream = require('./csv_stream')

let MICS = []
let unknownMics = new Set()
let operatingMics = new Map()
let segmentMicsObj = {}
let marketMics = new Set()

SEGMENT_MICS.forEach(mic => segmentMicsObj[mic] = undefined)

let onMicsParsed = () => 
    csvStream('equity_20190319.csv', {delimiter: ';'})
    .on('data', ({marketMic}) => {
        marketMics.add(marketMic)
        let mic = MICS.find(mic => mic.MIC === marketMic)
        

        if(!mic) return unknownMics.add(marketMic)
        
        if(mic['O/S'] === 'S') return delete segmentMicsObj[mic.MIC]

        //i.e mic is an operating mic, check if it has segment mics under it
        let segmentMics = MICS.filter(mic => mic['OPERATING MIC'] === marketMic).map(mic => mic.MIC)
        if(segmentMics.length <= 1) return 
        operatingMics.set(mic.MIC, segmentMics)
    })
    .on('end', () => {  
        console.log('unknownMics', unknownMics)
        console.log('operatingOrSemgntMics', JSON.stringify([...operatingMics.keys()], undefined, 2))
        console.log('marketMicsLength', [...marketMics].length)
        console.log('operatingOrSemgntMics.length', [...operatingMics.keys()].length)
        // console.log(JSON.stringify([...operatingMics.values()].reduce((a,b) => a.concat(b), [])))
        console.log('how many operatingOrSemgntMics has an equity in IDB on a segmentMic "under" the operatingOrSemgntMics', `${100 - Object.keys(segmentMicsObj).length / SEGMENT_MICS.length * 100} %`)
    })

csvStream('ISO10383_MIC.csv')
.on('data', data => MICS.push(data))
.on('end', onMicsParsed)

// alright vad fan är problemet, jo du har ett data set som du vill vaidera, där får du massa miccar, dom är både operating och segment, du vill kolla hur många av dessa miccar som är operating mics. 
// det är ju jätte många, varför då ? Jo för att det ett finns miccar i mic tabellen som bara har en rad, smamma segment mic som operating mic, alright dessa borde vara ok, de är ok enligt mattias. 
// Alright så då tar vi bort dom, vilka har vi kvar då ? svara på det du, alright så alltså ta fram alla miccar equity listan som är operating mics och handlar på flera handels platser, i.e har många rader i Mic tabellen
// ok då för vi

