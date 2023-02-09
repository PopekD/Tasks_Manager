const {Pool} = require('pg')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Slush",
    password: "root",
    port: 5432,
})

const GetUserPassword = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void ) {

        const email = body;

        try{
            const response = await pool.query("SELECT password FROM users WHERE email = $1", [email]);
            const data = await response.rows[0].password
            resolve(data)
        }catch(error: unknown){
            reject(error)
        }
    })
}

module.exports = {
    GetUserPassword
}