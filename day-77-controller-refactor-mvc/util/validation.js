function postIsValid(title, content) {
  return title && content && title.trim() !== "" && content.trim() !== "";
}

function userCredentialAreValid(email, confirmEmail, password) {
  return (
    email &&
    confirmEmail &&
    password &&
    password.trim().length >= 6 &&
    email === confirmEmail &&
    email.includes("@")
  );
}

module.exports = {
  postIsValid: postIsValid,
  userCredentialAreValid: userCredentialAreValid
};
