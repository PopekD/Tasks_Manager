import React, {FC, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'


const Login: FC = () => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          const token = res.json()
          .then((e) => {
            localStorage.setItem("token", e.valueOf())
          })
          navigate("/")

        } else {
          toast.error("Incorrect Username or Password")
        }
      })
      .catch((e) => {
        console.log(e)
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
      <Toaster />
    </div>
  );
}

export default Login;
