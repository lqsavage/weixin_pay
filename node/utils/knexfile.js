const pgConnection = require('../config/connection.js')
const knexConfig = {
    development: {
        client: 'pg',
        connection: pgConnection,
        debug: true
    },
    production: {
        client: 'pg',
        connection: pgConnection,
        version: '9.6',
        // searchPath: 'data', //似乎不写也没错
        pool: {
            min: 2,
            max: 10
        }
    }
}
module.exports = require('knex')(knexConfig[process.env.NODE_ENV || 'development'])