import React, { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'
import { Button, ButtonGroup } from "@chakra-ui/button"
import './Register.css'
const  Register: React.FC = () => {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    
    const navigate: NavigateFunction = useNavigate();

    const handleSubmit = (event: any) => {

        event.preventDefault();

        fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        })
            .then((res) => {
                if (res.ok) {
                    const token = res.json();
                    localStorage.setItem("token", token.toString())
                    navigate("/Login")

                } else {
                   const error = res.text()
                   .then((e) => {
                    toast.error(e.valueOf())}
                    )
                }
            })
            .catch((e) => {
                console.log(e)
            });
    };

    return (
        <div className='App'>
            <form onSubmit={handleSubmit} className='RegForm'>
                <label style={{
                    fontWeight: 'bolder',
                    fontSize: '32px',
                    color: 'black'
                }}>
                    CREATE ACCOUNT
                </label>
                    <input
                        type="email"
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                <br />

                    <input
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />

                <br />

                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                <br />
                <a onClick={() => navigate("/Login")} style={{ cursor: 'pointer', display: 'flex', alignSelf: "center" }}> <u>Already Have An Account ? Click<b> Here </b> </u></a>
                <Button colorScheme={'facebook'} size="lg" style={{ alignSelf: "center", minWidth: "10vw" }} type="submit">Submit</Button>
            </form>
            <Toaster/>
        </div>
    )
}

export default Register