import React from "react";
import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthHome from "./AuthHome";
import AuthHomeNo from "./AuthHomeNo";

function Home() {
  // const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:8081/home")
      .then((res) => {
        console.log(res);
        if (res.data.status === "Success") {
          setAuth(true);
          let name = res.data.name;
          const nameArray = name.split("-");

          setFirstName(nameArray[0]);
          setLastName(nameArray[1]);
          // navigate("/login");
        } else {
          setAuth(false);
          setMessage(res.data.status);
        }
      })
      .catch((err) => console.log(err));
  }, []);

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
