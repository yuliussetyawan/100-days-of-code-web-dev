function checkAuthStatus(req, res, next) {
  const uid = req.session.uid;

  if (!uid) {
    // skip into the next middleware
    return next();
  }

  res.locals.uid = uid;
  res.locals.isAuth = true;  
  next();
}

module.exports = checkAuthStatus;
