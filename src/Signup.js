import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./SignupValidation";
import axios from "axios";

function Signup() {
  const initValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
    checkedTerms: "*",
    checkedPrivacy: "*",
  };
  const initConsents = {
    currentTermsDocVersion: "",
    currentTermsDocUrl: "",
    currentPrivacyDocVersion: "",
    currentPrivacyDocUrl: "",
  };
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedPrivacy, setCheckedPrivacy] = useState(false);
  const [consents, setConsents] = useState(initConsents);
  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState(initValues);
  const navigate = useNavigate();

  //retrieve consents version
  useEffect(() => {
    //call accounts.getSchema CDC API
    let formdata = new FormData();
    formdata.append("include", "preferencesSchema");
    axios
      .post("http://localhost:8000/cdc/accounts.getSchema", formdata)
      .then((res) => {
        console.log("getSchema: ", res);
        if (res.data.errorCode === 0) {
          let consentInfo = {};
          consentInfo.currentTermsDocVersion =
            res.data.preferencesSchema.fields["terms.shop"].currentDocVersion;
          consentInfo.currentTermsDocUrl =
            res.data.preferencesSchema.fields[
              "terms.shop"
            ].legalStatements.en.documentUrl;
          consentInfo.currentPrivacyDocVersion =
            res.data.preferencesSchema.fields["privacy.shop"].currentDocVersion;
          consentInfo.currentPrivacyDocUrl =
            res.data.preferencesSchema.fields[
              "privacy.shop"
            ].legalStatements.en.documentUrl;
          setConsents(consentInfo);
        }
      });
  }, []);

  //handle on change events for both switches
  const handleChangeOne = () => {
    setCheckedTerms(!checkedTerms);
    if (checkedTerms) {
      errors.checkedTerms = "*";
    } else {
      errors.checkedTerms = "";
    }
  };
  const handleChangeTwo = () => {
    setCheckedPrivacy(!checkedPrivacy);
    if (checkedPrivacy) {
      errors.checkedPrivacy = "*";
    } else {
      errors.checkedPrivacy = "";
    }
  };

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
    let errors = validation(values, checkedTerms, checkedPrivacy);
    setErrors(errors);
    if (
      errors.email === "" &&
      errors.firstName === "" &&
      errors.lastName === "" &&
      errors.password === "" &&
      errors.password2 === "" &&
      errors.checkedTerms === "" &&
      errors.checkedPrivacy === ""
    ) {
      //call initRegister REGISTRATION system API
      axios
        .post("http://localhost:8000/custom/initRegister", values)
        .then((res) => {
          console.log("initRegister: ", res);
          if (res.data.status === "Success") {
            //call accounts.notifyLogin CDC API
            let siteUID = res.data.siteUID;
            console.log(siteUID);
            let formdata = new FormData();
            formdata.append("siteUID", siteUID);
            axios
              .post("http://localhost:8000/cdc/accounts.notifyLogin", formdata)
              .then((res) => {
                console.log("notifyLogin: ", res);
                if (res.status === 200) {
                  if (res.data.errorCode === 206001) {
                    let regToken = res.data.regToken;
                    //call accounts.setAccountInfo CDC API
                    let formdata = new FormData();
                    let date = new Date().toISOString();
                    let preferences = {};
                    let terms = {};
                    let shop = {};
                    let privacy = {};
                    let profile = {};
                    shop.isConsentGranted = true;
                    shop.lastConsentModified = shop.actionTimestamp = date;
                    terms.shop = privacy.shop = shop;
                    preferences.terms = terms;
                    preferences.privacy = privacy;
                    profile.email = values.email[0];
                    formdata.append("regToken", regToken);
                    formdata.append("profile", JSON.stringify(profile));
                    formdata.append("preferences", JSON.stringify(preferences));
                    formdata.append("lang", "en");
                    // console.log(preferences);
                    // console.log(profile);
                    axios
                      .post(
                        "http://localhost:8000/cdc/accounts.setAccountInfo",
                        formdata
                      )
                      .then((res) => {
                        console.log("setAccountInfo: ", res);
                        if ((res.status === 200) & (res.data.errorCode === 0)) {
                          //call accounts.finalizeRegistration CDC API
                          let formdata = new FormData();
                          formdata.append("regToken", regToken);
                          axios
                            .post(
                              "http://localhost:8000/cdc/accounts.finalizeRegistration",
                              formdata
                            )
                            .then((res) => {
                              console.log("finalizeRegistration: ", res);
                              if (
                                (res.status === 200) &
                                (res.data.errorCode === 0)
                              ) {
                                //call finalRegister REGISTRATION system API
                                axios
                                  .post("http://localhost:8081/finalRegister", {
                                    siteUID: siteUID,
                                  })
                                  .then((res) => {
                                    console.log("finalRegister: ", res);
                                    if (res.data.status === "Success") {
                                      navigate("/home", {
                                        state: {
                                          siteUID: siteUID,
                                        },
                                      });
                                    } else {
                                      alert(res.data.status);
                                    }
                                  })
                                  .catch((err) => console.log(err));
                              }
                            });
                        }
                      });
                  } else if (res.data.errorCode === 0) {
                    //call finalRegister REGISTRATION system API
                    axios
                      .post("http://localhost:8081/finalRegister", {
                        siteUID: siteUID,
                      })
                      .then((res) => {
                        if (res.data.status === "Success") {
                          navigate("/home", {
                            state: {
                              siteUID: siteUID,
                            },
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
        <h2>Register</h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName">
              <strong>First Name</strong>
            </label>
            <input
              id="firstName"
              type="firstName"
              name="firstName"
              placeholder="Enter First Name"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.firstName && (
              <span className="text-danger">{errors.firstName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="lastName">
              <strong>Last Name</strong>
            </label>
            <input
              id="lastName"
              type="lastName"
              name="lastName"
              placeholder="Enter Last Name"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.lastName && (
              <span className="text-danger">{errors.lastName}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              id="email"
              type="email"
              name="email"
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
              placeholder="Enter Password"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password2">
              <strong>Re-enter Password</strong>
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              placeholder="Re-enter Password"
              onChange={handleInput}
              className="form-control rounded-3"
            />
            {errors.password2 && (
              <span className="text-danger">{errors.password2}</span>
            )}
          </div>
          <p className="mb-1">You must agree to our terms and policies:</p>
          <div className="mb-1">
            <label htmlFor="terms">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  name="darkmode"
                  value="yes"
                  checked={checkedTerms}
                  onChange={handleChangeOne}
                />
                <label className="form-check-label" htmlFor="terms">
                  Terms and Condition &nbsp;
                  <a className="" href={consents.currentTermsDocUrl}>
                    version {consents.currentTermsDocVersion}
                  </a>
                </label>
              </div>
            </label>
            {errors.checkedTerms && (
              <span className="text-danger">{errors.checkedTerms}</span>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="privacy">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="privacy"
                  name="darkmode"
                  value="yes"
                  checked={checkedPrivacy}
                  onChange={handleChangeTwo}
                />
                <label className="form-check-label" htmlFor="privacy">
                  Privacy Policy &nbsp;
                  <a className="" href={consents.currentTermsDocUrl}>
                    version {consents.currentPrivacyDocVersion}
                  </a>
                </label>
              </div>
            </label>
            {errors.checkedPrivacy && (
              <span className="text-danger">{errors.checkedPrivacy}</span>
            )}
          </div>
          <button type="submit" className="btn btn-success w-100">
            <strong>Register</strong>
          </button>
          <Link
            to="/login"
            className="btn btn-default border w-100 bg-light text-decoration-none"
          >
            Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
