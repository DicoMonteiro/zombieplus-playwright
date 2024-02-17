const { Pool } = require('pg')

const DbConfig = {
    user: 'jxvuegzw',
    host: 'chunee.db.elephantsql.com',
    database: 'jxvuegzw',
    password: 'WnPDsfnZfv0TwFU0AYy8UMbYT987VKaF',
    port: 5432
}


export async function executeSQL(sqlScript) {

    try {
        const pool = new Pool(DbConfig)
        const client = await pool.connect()
        const result = await client.query(sqlScript)
        console.log(result.rows)
    } catch (error) {
        console.log('Erro ao executar o script SQL: ' + error)
    }

}