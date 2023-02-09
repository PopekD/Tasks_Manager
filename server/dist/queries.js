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
module.exports = {
    GetUserPassword,
    CreateAccount
};
//# sourceMappingURL=queries.js.map