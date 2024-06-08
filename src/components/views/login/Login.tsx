import { useState } from "react";
import "./style/login.scss";
import axios from "axios";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authCondition, setAuthCondition] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });

  const handleSignUp = async () => {
    if (isSignUp) {
      const res = await axios.post(
        "http://localhost:8333/api/auth",
        authCondition
      );

      if (res) {
        console.log(res, "register Res");
      }
    } else {
      setIsSignUp(true);
    }
  };

  const handleLogin = async () => {
    const res = await axios.post(
      "http://localhost:8333/api/auth/login",
      authCondition
    );

    if (res) {
      localStorage.setItem("token", res.data);
      console.log(res, "login res!");
    }
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setAuthCondition((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <section className="login-section">
      <div className="login-wrapper">
        <h2>{`${isSignUp ? "Sign Up" : "Log in"}`}</h2>
        <GoogleLoginButton />
        <div className="login-input-container">
          <div className="login-input-wrapper">
            <label>EMAIL</label>
            <input onChange={(e) => handleOnChange(e, "email")} />
          </div>

          <div className="login-input-wrapper">
            <label>PASSWORD</label>
            <input onChange={(e) => handleOnChange(e, "password")} />
          </div>

          <button onClick={handleLogin}>Login</button>

          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    </section>
  );
};

export default Login;
