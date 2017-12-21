const xml2js = require('xml2js')
const parser = new xml2js.Parser()

module.exports = (ctx, next) => {
    return new Promise((resolve, reject) => {
        if (ctx.is('text/xml')) {
            ctx.req.on('data', (data) => {
                parser.parseString(data, (err, result) => {
                    resolve(result.xml)
                })
            })
        } else resolve(1)
    }).then((data) => {
        if (data != 1) ctx.xml = data
        next()
    })
}