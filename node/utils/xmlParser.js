/*
    解析xml
*/
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
module.exports = (string) => {
    return new Promise((resolve, reject) => {
        parser.parseString(string, (err, data) => {
            if (err) { return reject(err); }
            return resolve(data.xml);
        })
    });
}
