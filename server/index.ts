import express, { Express, Request, Response } from "express";


const app: Express = express();
const db = require('./queries')
require('dotenv').config()

require('crypto').randomBytes(64).toString('hex')
process.env.TOKEN_SECRET;
const jwt = require('jsonwebtoken');


app.use(express.json());


function generateAccessToken(user: any) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


app.post('/api/login', async (req: Request, res: Response) => {
   try
   {
        const databaseQuery = await db.GetUserPassword(req.body.email)
        if (databaseQuery == req.body.password ) {
            const token = generateAccessToken({ user: req.body.email });
            res.json(token);
        }
   }
   catch(e) {
        console.log(e)
        res.status(401).send(e)
   }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});