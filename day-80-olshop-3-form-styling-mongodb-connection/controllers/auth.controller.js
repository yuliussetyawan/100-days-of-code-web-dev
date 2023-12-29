function getSignup(req, res) {
  res.render("customer/auth/signup");
}

function signup(req, res) {}

function getLogin(req, res) {}

module.exports = {
  getSignUp: getSignup,
  getLogin: getLogin,
  signup: signup,
};
