import React, {FC, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import toast, {Toaster} from 'react-hot-toast'
import { Button, ButtonGroup } from "@chakra-ui/button"



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
          res.json()
          .then((e) => {
            localStorage.setItem("token", e.valueOf())
          })
            .then(() => navigate("/"))
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
      <form onSubmit={handleSubmit} className="LoginForm">
          <label style={{ 
            fontWeight: 'bolder',
            fontSize: '32px',
            color: 'black'
          }}>
            LOGIN
          </label>
          <div> 
          <input
            placeholder='Email'
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <br />
          <input
            placeholder='Password'
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          </div>
        <br />
        <a onClick={() => navigate("/Register")} style={{ cursor: 'pointer', display: 'flex', alignSelf: "center" }}><u> Create Account  <b> Here</b> </u></a>
        <Button colorScheme={'facebook'} size="lg" style={{alignSelf: "center", minWidth: "10vw"}} type="submit">Log In</Button>
      </form>
      <Toaster />
    </div>
  );
}

export default Login;
