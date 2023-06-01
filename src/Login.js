import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./LoginValidation";
import axios from "axios";

function Login() {
  const initValues = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState(initValues);
  const navigate = useNavigate();

  //handle input
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };

  //handle submit
  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));
    if (errors.email === "" && errors.password === "") {
      //call initLogin REGISTRATION system API
      axios
        .post("http://localhost:8081/initLogin", values)
        .then((res) => {
          console.log("initLogin: ", res);
          if (res.data.status === "Success") {
            let consentInfo = {};
            consentInfo.siteUID = res.data.siteUID;
            // console.log(siteUID);
            let formdata = new FormData();
            formdata.append("siteUID", consentInfo.siteUID);
            axios
              .post("http://localhost:8000/cdc/accounts.notifyLogin", formdata)
              .then((res) => {
                console.log("notifyLogin: ", res);
                if (res.status === 200) {
                  if (res.data.errorCode === 206001) {
                    consentInfo.errorDetails = res.data.errorDetails;
                    consentInfo.regToken = res.data.regToken;

                    //call accounts.getSchema CDC API
                    let formdata = new FormData();
                    formdata.append("include", "preferencesSchema");
                    axios
                      .post(
                        "http://localhost:8000/cdc/accounts.getSchema",
                        formdata
                      )
                      .then((res) => {
                        console.log("getSchema: ", res);
                        if (res.data.errorCode === 0) {
                          consentInfo.currentTermsDocVersion =
                            res.data.preferencesSchema.fields[
                              "terms.shop"
                            ].currentDocVersion;
                          consentInfo.currentTermsDocUrl =
                            res.data.preferencesSchema.fields[
                              "terms.shop"
                            ].legalStatements.en.documentUrl;
                          consentInfo.currentPrivacyDocVersion =
                            res.data.preferencesSchema.fields[
                              "privacy.shop"
                            ].currentDocVersion;
                          consentInfo.currentPrivacyDocUrl =
                            res.data.preferencesSchema.fields[
                              "privacy.shop"
                            ].legalStatements.en.documentUrl;

                          navigate("/consent", {
                            state: consentInfo,
                          });
                        }
                      });
                  } else if (res.data.errorCode === 0) {
                    //call finalLogin REGISTRATION system API
                    axios
                      .post("http://localhost:8081/finalLogin", {
                        siteUID: consentInfo.siteUID,
                      })
                      .then((res) => {
                        console.log("finalLogin: ", res);
                        if (res.data.status === "Success") {
                          navigate("/home", {
                            state: consentInfo.siteUID,
                          });
                        } else {
                          alert(res.data.status);
                        }
                      })
                      .catch((err) => console.log(err));
                  }
                }
              })
              .catch((err) => console.log(err));
          } else {
            alert(res.data.status);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              // value="ruslim@sap.com"
              placeholder="Enter Email"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              // value="Welcome1!"
              placeholder="Enter Password"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100">
            <strong>Log In</strong>
          </button>
          {/* <p>You agree to our terms and policies</p> */}
          <Link
            to="/register"
            className="btn btn-default border w-100 bg-light text-decoration-none"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
