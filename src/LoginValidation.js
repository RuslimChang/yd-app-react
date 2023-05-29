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

  if (values.password === "") {
    error.password = "Password should not be empty";
    // } else if (values.password[0].length < 8) {
    //   error.password = "Password length must be at least 8";
  } else {
    error.password = "";
  }

  return error;
}

export default Validation;
