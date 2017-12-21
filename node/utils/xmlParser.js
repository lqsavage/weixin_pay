/*
    解析xml
*/
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
module.exports = (string) => {
    return new Promise((resolve, reject) => {
        parser.parseString(string, (err, data) => {
            if (err) { 
                console.log('err', err)
                return reject(err)
            }
            if(data.xml) resolve(data.xml)
            else resolve(data.root)
        })
    });
}
