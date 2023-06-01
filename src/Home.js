import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthHome from "./AuthHome";
import AuthHomeNo from "./AuthHomeNo";

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { state } = useLocation();

  axios.defaults.withCredentials = true;
  useEffect(() => {
    //call protective page
    axios
      .post("http://localhost:8081/home", { siteUID: state })
      .then((res) => {
        console.log("home: ", res);
        if (res.data.status === "Success") {
          setAuth(true);
          let name = res.data.name;
          const nameArray = name.split("-");

          setFirstName(nameArray[0]);
          setLastName(nameArray[1]);
        } else {
          setAuth(false);
          setMessage(res.data.status);
        }
      })
      .catch((err) => console.log(err));
  }, [state]);

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      {auth ? (
        <AuthHome firstName={firstName} lastName={lastName} />
      ) : (
        <AuthHomeNo message={message} />
      )}
    </div>
  );
}

export default Home;
