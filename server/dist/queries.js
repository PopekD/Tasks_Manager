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
module.exports = {
    GetUserPassword
};
//# sourceMappingURL=queries.js.map