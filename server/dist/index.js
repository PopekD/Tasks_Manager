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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt = require("bcrypt");
const path = require('path');
const app = (0, express_1.default)();
const db = require('./queries');
require('dotenv').config();
require('crypto').randomBytes(64).toString('hex');
process.env.TOKEN_SECRET;
const jwt = require('jsonwebtoken');
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '9999 years' });
}
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const databaseQuery = yield db.GetUserPassword(req.body.email);
        bcrypt.compare(req.body.password, databaseQuery, function (err, result) {
            if (result) {
                const token = generateAccessToken({ user: req.body.email });
                res.json(token);
            }
        });
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const databaseQuery = yield db.CreateAccount(req.body);
        res.sendStatus(200);
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
app.post('/api/GetUsername', (req, res) => {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield db.GetUserInfo(user.user);
            const data = yield response;
            res.send(data);
        }
        catch (e) {
            res.send(e);
        }
    }));
});
app.post('/api/GetExercises', (req, res) => {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield db.GetUserExercises(user.user);
            res.send(response);
        }
        catch (e) {
            res.send(e);
        }
    }));
});
app.post('/api/GetUserSharedExercises', (req, res) => {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield db.GetUserSharedExercises(user.user);
            res.send(response);
        }
        catch (e) {
            res.send(e);
        }
    }));
});
app.post('/api/GetSharedExercises', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.GetSharedExercises();
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
app.post('/api/saveTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.SaveTask(req.body);
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
app.post('/api/modifyTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.modifyTask(req.body);
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
app.post('/api/DeleteTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.DeleteTask(req.body);
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
app.post('/api/shareTask', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.ShareTask(req.body);
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
app.post('/api/StopSharing', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield db.StopSharing(req.body);
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}));
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map