const {Pool} = require('pg')
const bcrypt = require('bcrypt')
 
const saltRounds = 10;

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
            const data = await response.rows[0].password;
            resolve(data);
        }catch(error: unknown){
            reject(error);
        }
    })
}
const CheckIfExist_Email = async (email: any) => {
        const res = await pool.query("SELECT id FROM users where email = $1", [email])
        return res.rows.length > 0;
}
const CheckIfExist_Username = async (username: any) => {
        const res = await pool.query("SELECT id FROM users where username = $1", [username])
        return res.rows.length > 0;
}
const GetUserId = async (email: any) => {
    const res = await pool.query("SELECT id FROM users where email = $1", [email])
    return res.rows[0].id
}
const GetUserId_Username = async (username: any) => {
    const res = await pool.query("SELECT id FROM users where username = $1", [username])
    return res.rows[0].id
}
const GetTask_ID = async (name: any) => {
    const res = await pool.query("SELECT id FROM exercises where name = $1", [name])
    return res.rows[0].id
}

const CreateAccount = (body: any) => { 
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {

        const check_email = await CheckIfExist_Email(body.email)
        const check_username = await CheckIfExist_Username(body.username)
        const email = body.email
        const username = body.username
        const password = body.password

        try{
            if (!check_email)
            {
                if(!check_username)
                {
                    const hash = bcrypt.hashSync(password, saltRounds);
                    await pool.query("INSERT INTO users (email, password, username, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW());", [email, hash, username])
                    resolve("Account Created Successfully")
                }
                else
                {
                    reject("Username Already Taken")
                }
            }
            else 
            {
                reject("Email already taken")
            }
        }
        catch(e: unknown){
            reject(e)
        }

    })
}

const GetUserInfo = (eyo: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try 
        {

            const email = eyo
            const data = await GetUserId(email)
            const response = await pool.query("SELECT username FROM users WHERE users.id = $1", [data]);
            resolve(response.rows[0].username)
        } 
        catch (error: unknown) 
        {
            reject("Acces Denied")
        }
    })
}

const GetUserExercises = (eyo: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const email = eyo
            const data = await GetUserId(email)
            const response = await pool.query("SELECT name, description FROM exercises WHERE user_id = $1", [data]);
            resolve(response.rows)
        }
        catch (error: unknown) {
            console.log(error)
            reject("Acces Denied")
        }
    })
}

const SaveTask = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const username = body.username;
            const id = await GetUserId_Username(username)
            const name = body.name;
            const description = body.description;
            await pool.query("INSERT INTO exercises (user_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW());", [id, name, description])
            resolve("Success")
        }
        catch (error: unknown) {
            console.log(error)
            reject("Something went wrong")
        }
    })
}
const DeleteTask = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const username = body.username;
            const id = await GetUserId_Username(username)
            const name = body.valueName;
            await pool.query("DELETE FROM exercises WHERE name = $1 AND user_id = $2", [name, id])
            resolve("Success")
        }
        catch (error: unknown) {
            console.log(error)
            reject("Something went wrong")
        }
    })

}

const ShareTask = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const name = body.selectedOption;
            const user_id = await GetUserId_Username(body.username);
            const id = await GetTask_ID(name)
            await pool.query("INSERT INTO shared_exercises (exercise_id, shared_by, created_at, updated_at) VALUES ($1, $2, NOW(), NOW());", [id, user_id])
            resolve("Success")
        }
        catch (error: unknown) {
            console.log(error)
            reject("Something went wrong")
        }
    })
}

module.exports = {
    GetUserPassword,
    CreateAccount,
    GetUserInfo,
    GetUserExercises,
    SaveTask,
    DeleteTask,
    ShareTask
}