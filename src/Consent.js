import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthHomeNo from "./AuthHomeNo";

function Consent() {
  const navigate = useNavigate();
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedPrivacy, setCheckedPrivacy] = useState(false);
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const { state } = useLocation();

  //handle on change events
  var errors = {};
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

  useEffect(() => {
    if (state === null) {
      setAuth(false);
      setMessage("Consent");
    } else {
      setAuth(true);
      //Determine switch position for TOC and Privacy Policy
      let errorDetails = state.errorDetails;
      if (errorDetails.includes("terms")) {
        setCheckedTerms(false);
      } else {
        setCheckedTerms(true);
      }

      if (errorDetails.includes("privacy")) {
        setCheckedPrivacy(false);
      } else {
        setCheckedPrivacy(true);
      }
    }
  }, [state]);

  //handle submit
  const handleSubmit = (event) => {
    event.preventDefault();
    if (checkedTerms === true && checkedPrivacy === true) {
      //call accounts.setAccountInfo CDC API
      let formdata = new FormData();
      let date = new Date().toISOString();
      let preferences = {};
      let terms = {};
      let shop = {};
      let privacy = {};
      shop.isConsentGranted = true;
      shop.lastConsentModified = shop.actionTimestamp = date;
      terms.shop = privacy.shop = shop;
      preferences.terms = terms;
      preferences.privacy = privacy;
      formdata.append("regToken", state.regToken);
      formdata.append("preferences", JSON.stringify(preferences));
      formdata.append("lang", "en");
      // console.log(preferences);
      axios
        .post("http://localhost:8000/cdc/accounts.setAccountInfo", formdata)
        .then((res) => {
          console.log("setAccountInfo: ", res);
          if ((res.status === 200) & (res.data.errorCode === 0)) {
            //call accounts.finalizeRegistration CDC API
            let formdata = new FormData();
            formdata.append("regToken", state.regToken);
            axios
              .post(
                "http://localhost:8000/cdc/accounts.finalizeRegistration",
                formdata
              )
              .then((res) => {
                console.log("finalizeRegistration: ", res);
                if ((res.status === 200) & (res.data.errorCode === 0)) {
                  //call finalRegister REGISTRATION system API
                  axios
                    .post("http://localhost:8081/finalRegister", {
                      siteUID: state.siteUID,
                    })
                    .then((res) => {
                      console.log("finalRegister: ", res);
                      if (res.data.status === "Success") {
                        navigate("/home", {
                          state: state.siteUID,
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
    } else {
      alert("You must consent to our terms and policies");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      {auth ? (
        <div className="bg-white p-3 rounded w-25">
          <h2>Consent</h2>
          <form action="" onSubmit={handleSubmit}>
            <p>
              To access the website, You must agree to our terms and policies:
            </p>
            <div className="mb-3">
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
                    <a className="" href={state.currentTermsDocUrl}>
                      version {state.currentTermsDocVersion}
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
                    <a className="" href={state.currentTermsDocUrl}>
                      version {state.currentPrivacyDocVersion}
                    </a>
                  </label>
                </div>
              </label>
              {errors.checkedPrivacy && (
                <span className="text-danger">{errors.checkedPrivacy}</span>
              )}
            </div>
            <button type="submit" className="btn btn-success w-100">
              <strong>Submit</strong>
            </button>
          </form>
        </div>
      ) : (
        <AuthHomeNo message={message} />
      )}
    </div>
  );
}

export default Consent;
