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
    host: "localhost",
    database: "Slush",
    password: "root",
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
                const response = yield pool.query("SELECT name, description FROM exercises WHERE user_id = $1", [data]);
                console.log(response.rows);
                resolve(response.rows);
            }
            catch (error) {
                console.log(error);
                reject("Acces Denied");
            }
        });
    });
};
module.exports = {
    GetUserPassword,
    CreateAccount,
    GetUserInfo,
    GetUserExercises
};
//# sourceMappingURL=queries.js.map