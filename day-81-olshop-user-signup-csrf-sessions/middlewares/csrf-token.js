function addCsrfToken(req, res, next){
  // generate csrf token and saved it in locals variable
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken