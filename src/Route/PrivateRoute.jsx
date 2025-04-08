import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // console.log(localStorage);

  // const [login, setLogin] = useState(JSON.parse(localStorage.getItem("login")));
  const [login, setLogin] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  // console.log(authenticated);

  useEffect(() => {

    if (localStorage.getItem("login")) {
      setLogin(JSON.parse(localStorage.getItem("login")));
    }

    setAuthenticated(JSON.parse(localStorage.getItem("authenticated")));
    // localStorage.setItem("authenticated", authenticated);

    // localStorage.setItem("login", login);
  }, []);
  return localStorage.authenticated ? <Outlet /> : <Navigate exact to={`${process.env.PUBLIC_URL}/login`} />;
};

export default PrivateRoute;
