const {Pool} = require('pg')
const bcrypt = require('bcryptjs')
 
const saltRounds = 10;

const pool = new Pool({
    user: "postgres",
    host: "slush.cjyaty8k3acu.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "berlinwoodek1",
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
            const response = await pool.query("SELECT name, description FROM exercises WHERE user_id = $1 AND shared = false", [data]);
            resolve(response.rows)
        }
        catch (error: unknown) {
            console.log(error)
            reject("Acces Denied")
        }
    })
}
const GetUserSharedExercises = (eyo: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const email = eyo
            const data = await GetUserId(email)
            const response = await pool.query("SELECT name, description FROM exercises WHERE user_id = $1 AND shared = true", [data]);
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

const modifyTask = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {

            const username = body.username;
            const name = body.task_name

            const user_id = await GetUserId_Username(username)
            const task_id = await GetTask_ID(name)

            const modifiedName = body.modifiedName;
            const modifiedDescription = body.modifiedDescription;
            await pool.query("UPDATE exercises SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4", [modifiedName, modifiedDescription, task_id, user_id])
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
            await pool.query("UPDATE exercises SET shared = true WHERE id = $1 AND user_id = $2", [id, user_id])
            resolve("Success")
        }
        catch (error: unknown) {
            console.log(error)
            reject("Something went wrong")
        }
    })
}
const StopSharing = (body: any) => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const name = body.valueName;
            const user_id = await GetUserId_Username(body.username);
            const task_id = await GetTask_ID(name)
            await pool.query("DELETE FROM shared_exercises WHERE exercise_id = $1 AND shared_by = $2;", [task_id, user_id])
            await pool.query("UPDATE exercises SET shared = false WHERE id = $1 AND user_id = $2", [task_id, user_id])
            resolve("Success")
        }
        catch (error: unknown) {
            console.log(error)
            reject("Something went wrong")
        }
    })
}

const GetSharedExercises = () => {
    return new Promise(async function (resolve: (value: unknown) => void, reject: (reason?: any) => void) {
        try {
            const response = await pool.query("SELECT users.username, exercises.name, exercises.description FROM users JOIN shared_exercises ON users.id = shared_exercises.shared_by JOIN exercises ON exercises.id = shared_exercises.exercise_id;")
            resolve(response.rows)
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
    ShareTask,
    modifyTask, 
    GetSharedExercises,
    GetUserSharedExercises,
    StopSharing
}