const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "chatApp",
    password: "root",
    port: 5432,
})
