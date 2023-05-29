function Validation(values) {
  let error = {};

  const email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (values.email === "") {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email is not valid";
  } else {
    error.email = "";
  }

  if (values.firstName === "") {
    error.firstName = "First Name should not be empty";
  } else {
    error.firstName = "";
  }

  error.lastName = "";

  if (values.password === "") {
    error.password = "Password should not be empty";
  } else if (values.password[0].length < 8) {
    error.password = "Password length must be at least 8";
  } else if (!values.password[0] === values.password2[0]) {
    error.password = "Password is not identical ";
  } else {
    error.password = "";
  }

  if (values.password2 === "") {
    error.password2 = "Re-enter password here";
  } else if (values.password2[0].length < 8) {
    error.password2 = "Password length must be at least 8";
  } else if (!values.password2[0] === values.password[0]) {
    error.password2 = "Password is not identical ";
  } else {
    error.password2 = "";
  }

  return error;
}

export default Validation;
