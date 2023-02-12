"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = new Pool({
    user: "postgres",
    host: "slush.cjyaty8k3acu.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "berlinwoodek1",
    port: 5432,
});
const GetUserPassword = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = body;
            try {
                const response = yield pool.query("SELECT password FROM users WHERE email = $1", [email]);
                const data = yield response.rows[0].password;
                resolve(data);
            }
            catch (error) {
                reject(error);
            }
        });
    });
};
const CheckIfExist_Email = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield pool.query("SELECT id FROM users where email = $1", [email]);
    return res.rows.length > 0;
});
const CheckIfExist_Username = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield pool.query("SELECT id FROM users where username = $1", [username]);
    return res.rows.length > 0;
});
const GetUserId = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield pool.query("SELECT id FROM users where email = $1", [email]);
    return res.rows[0].id;
});
const GetUserId_Username = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield pool.query("SELECT id FROM users where username = $1", [username]);
    return res.rows[0].id;
});
const GetTask_ID = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield pool.query("SELECT id FROM exercises where name = $1", [name]);
    return res.rows[0].id;
});
const CreateAccount = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            const check_email = yield CheckIfExist_Email(body.email);
            const check_username = yield CheckIfExist_Username(body.username);
            const email = body.email;
            const username = body.username;
            const password = body.password;
            try {
                if (!check_email) {
                    if (!check_username) {
                        const hash = bcrypt.hashSync(password, saltRounds);
                        yield pool.query("INSERT INTO users (email, password, username, created_at, updated_at) VALUES($1, $2, $3, NOW(), NOW());", [email, hash, username]);
                        resolve("Account Created Successfully");
                    }
                    else {
                        reject("Username Already Taken");
                    }
                }
                else {
                    reject("Email already taken");
                }
            }
            catch (e) {
                reject(e);
            }
        });
    });
};
const GetUserInfo = (eyo) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = eyo;
                const data = yield GetUserId(email);
                const response = yield pool.query("SELECT username FROM users WHERE users.id = $1", [data]);
                resolve(response.rows[0].username);
            }
            catch (error) {
                reject("Acces Denied");
            }
        });
    });
};
const GetUserExercises = (eyo) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = eyo;
                const data = yield GetUserId(email);
                const response = yield pool.query("SELECT name, description FROM exercises WHERE user_id = $1 AND shared = false", [data]);
                resolve(response.rows);
            }
            catch (error) {
                console.log(error);
                reject("Acces Denied");
            }
        });
    });
};
const GetUserSharedExercises = (eyo) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = eyo;
                const data = yield GetUserId(email);
                const response = yield pool.query("SELECT name, description FROM exercises WHERE user_id = $1 AND shared = true", [data]);
                resolve(response.rows);
            }
            catch (error) {
                console.log(error);
                reject("Acces Denied");
            }
        });
    });
};
const SaveTask = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = body.username;
                const id = yield GetUserId_Username(username);
                const name = body.name;
                const description = body.description;
                yield pool.query("INSERT INTO exercises (user_id, name, description, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW());", [id, name, description]);
                resolve("Success");
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
const modifyTask = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = body.username;
                const name = body.task_name;
                const user_id = yield GetUserId_Username(username);
                const task_id = yield GetTask_ID(name);
                const modifiedName = body.modifiedName;
                const modifiedDescription = body.modifiedDescription;
                yield pool.query("UPDATE exercises SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4", [modifiedName, modifiedDescription, task_id, user_id]);
                resolve("Success");
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
const DeleteTask = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = body.username;
                const id = yield GetUserId_Username(username);
                const name = body.valueName;
                yield pool.query("DELETE FROM exercises WHERE name = $1 AND user_id = $2", [name, id]);
                resolve("Success");
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
const ShareTask = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = body.selectedOption;
                const user_id = yield GetUserId_Username(body.username);
                const id = yield GetTask_ID(name);
                yield pool.query("INSERT INTO shared_exercises (exercise_id, shared_by, created_at, updated_at) VALUES ($1, $2, NOW(), NOW());", [id, user_id]);
                yield pool.query("UPDATE exercises SET shared = true WHERE id = $1 AND user_id = $2", [id, user_id]);
                resolve("Success");
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
const StopSharing = (body) => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = body.valueName;
                const user_id = yield GetUserId_Username(body.username);
                const task_id = yield GetTask_ID(name);
                yield pool.query("DELETE FROM shared_exercises WHERE exercise_id = $1 AND shared_by = $2;", [task_id, user_id]);
                yield pool.query("UPDATE exercises SET shared = false WHERE id = $1 AND user_id = $2", [task_id, user_id]);
                resolve("Success");
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
const GetSharedExercises = () => {
    return new Promise(function (resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield pool.query("SELECT users.username, exercises.name, exercises.description FROM users JOIN shared_exercises ON users.id = shared_exercises.shared_by JOIN exercises ON exercises.id = shared_exercises.exercise_id;");
                resolve(response.rows);
            }
            catch (error) {
                console.log(error);
                reject("Something went wrong");
            }
        });
    });
};
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
};
//# sourceMappingURL=queries.js.map