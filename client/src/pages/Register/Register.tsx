import React, { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'

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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Log In</button>
            </form>
            <Toaster/>
        </div>
    )
}

export default Register