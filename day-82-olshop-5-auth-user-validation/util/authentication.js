function createUserSession(req, user, action) {
  req.session.uid = user._id.toString();
  // the 'action' will only be executed once the session was succesfully saved in the store
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
