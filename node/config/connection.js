/*
    postgresql链接配置信息
*/
let connection = {
    development: {
        host: 'localhost',
        user: 'xjp',
        password: '1234',
        database: 'pay',
        port: '5432'
    },
    production: {
        host: 'localhost',
        user: 'xjp',
        password: '1234',
        database: 'pay',
        port: '5432'
    }
}
module.exports = connection[process.env.NODE_ENV || 'development']