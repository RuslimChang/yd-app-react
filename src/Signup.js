import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios";

function Signup() {
  const initValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
  };
  const [values, setValues] = useState(initValues);
  const [errors, setErrors] = useState(initValues);
  const navigate = useNavigate();
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if (
      errors.email === "" &&
      errors.firstName === "" &&
      errors.lastName === "" &&
      errors.password === "" &&
      errors.password2 === ""
    ) {
      axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          console.log(res);
          if (res.data.status === "Success") {
            navigate("/login");
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
          <button type="submit" className="btn btn-success w-100">
            <strong>Register</strong>
          </button>
          {/* <p>You agree to our terms and policies</p> */}
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
