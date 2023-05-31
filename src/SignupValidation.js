function validation(values, checkedTerms, checkedPrivacy) {
  let errors = {};

  // const email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  //validate email
  if (values.email === "") {
    errors.email = "Email should not be empty";
    // } else if (!email_pattern.test(values.email)) {
    //   errors.email = "Email is not valid";
  } else {
    errors.email = "";
  }

  //validate firstName
  if (values.firstName === "") {
    errors.firstName = "First Name should not be empty";
  } else {
    errors.firstName = "";
  }

  //validate lastName
  if (values.lastName === "") {
    errors.lastName = "Last Name should not be empty";
  } else {
    errors.lastName = "";
  }

  //validate password
  if (values.password === "") {
    errors.password = "Password should not be empty";
  } else if (values.password[0].length < 8) {
    errors.password = "Password length must be at least 8";
  } else if (!values.password[0] === values.password2[0]) {
    errors.password = "Password is not identical ";
  } else {
    errors.password = "";
  }

  //validate password2
  if (values.password2 === "") {
    errors.password2 = "Re-enter password here";
  } else if (values.password2[0].length < 8) {
    errors.password2 = "Password length must be at least 8";
  } else if (!values.password2[0] === values.password[0]) {
    errors.password2 = "Password is not identical ";
  } else {
    errors.password2 = "";
  }

  //validate terms
  if (checkedTerms) {
    errors.checkedTerms = "";
  } else {
    errors.checkedTerms = "*";
  }

  //validate privacy
  if (checkedPrivacy) {
    errors.checkedPrivacy = "";
  } else {
    errors.checkedPrivacy = "*";
  }
  return errors;
}

export default validation;
