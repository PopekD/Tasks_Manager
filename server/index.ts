import express, { Express, Request, Response } from "express";
const bcrypt = require("bcryptjs")
const path = require('path');
const app: Express = express();
const db = require('./queries')
require('dotenv').config()

require('crypto').randomBytes(64).toString('hex')
process.env.TOKEN_SECRET;
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use(express.static("public"))

function generateAccessToken(user: any) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '9999 years' });
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

app.post('/api/login', async (req: Request, res: Response) => {
   try
   {
        const databaseQuery = await db.GetUserPassword(req.body.email)


       bcrypt.compare(req.body.password, databaseQuery, function (err: any, result: any) {
           if (result) {
               const token = generateAccessToken({ user: req.body.email });
               res.json(token);
           }
       });

   }
   catch(e) {
        res.status(401).send(e)
   }
});

app.post('/api/register', async(req: Request, res: Response) => {
    try{
        const databaseQuery = await db.CreateAccount(req.body)
        res.sendStatus(200)
    }
    catch(e){
        res.status(401).send(e)
    }
})

app.post('/api/GetUsername', (req: Request, res: Response)=> {

    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string, async (err: any, user: any) => {
        try {
            const response = await db.GetUserInfo(user.user)
            const data = await response
            res.send(data)
        }
        catch(e)
        {
            res.send(e)
        }

    })
    
})

app.post('/api/GetExercises', (req: Request, res: Response) => {

    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string, async (err: any, user: any) => {
        try {
            const response = await db.GetUserExercises(user.user)
            res.send(response)
        }
        catch (e) {
            res.send(e)
        }

    })

})
app.post('/api/GetUserSharedExercises', (req: Request, res: Response) => {

    jwt.verify(req.body.token, process.env.TOKEN_SECRET as string, async (err: any, user: any) => {
        try {
            const response = await db.GetUserSharedExercises(user.user)
            res.send(response)
        }
        catch (e) {
            res.send(e)
        }

    })

})

app.post('/api/GetSharedExercises', async(req: Request, res: Response) => {
    try
    {
        const response = await db.GetSharedExercises()
        res.send(response)
    }
    catch(e)
    {
        res.send(e)
    }
})

app.post('/api/saveTask', async (req: Request, res: Response) => {

    try
    {
        const response = await db.SaveTask(req.body)
        res.send(response)
    }
    catch(e)
    {
        res.send(e)
    }

})

app.post('/api/modifyTask', async (req: Request, res: Response) => {

    try {
        const response = await db.modifyTask(req.body)
        res.send(response)
    }
    catch (e) {
        res.send(e)
    }

})


app.post('/api/DeleteTask', async (req: Request, res: Response) => {

    try {
        const response = await db.DeleteTask(req.body)
        res.send(response)
    }
    catch (e) {
        res.send(e)
    }

})

app.post('/api/shareTask', async (req: Request, res: Response) => {

    try {
        const response = await db.ShareTask(req.body)
        res.send(response)
    }
    catch (e) {
        res.send(e)
    }

})

app.post('/api/StopSharing', async (req: Request, res: Response) => {

    try {
        const response = await db.StopSharing(req.body)
        res.send(response)
    }
    catch (e) {
        res.send(e)
    }

})

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});