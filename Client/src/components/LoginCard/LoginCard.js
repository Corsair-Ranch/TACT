import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.js";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { CardActions } from "@mui/material";
import { useKeycloak } from "@react-keycloak/web";

const LoginCard = () => {
  const { keycloak } = useKeycloak();
  // const [userNameInput, setUserNameInput] = useState();
  // const [userPasswordInput, setUserPasswordInput] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { tryLogin } = useAppContext();
  const nav = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await keycloak.login({
        username, password,
      })
    } catch (error) {
      console.error("Failed Login", error);
    }
  }

  // const saveUserNameInput = (input) => {
  //   // Note -> you can do user valuations here for what the user puts in.
  //   // or if you using email address we can also set up something like a regex or better
  //   setUserNameInput(input.toString());
  // };
  //
  // const savePasswordInput = (input) => {
  //   setUserPasswordInput(input.toString());
  // };
  //
  // const handleRoute = () => {
  //   nav("/signup");
  // };

  return (
      <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
  );
};

export default LoginCard;
