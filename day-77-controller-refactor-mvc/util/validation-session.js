function getSessionErrorData(req, defaultValues) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      // adding default values, so everytime we get single post, the title and content isn't empty
      ...defaultValues
    };
  }

  req.session.inputData = null;
  return sessionInputData;
}

function flashErrorToSession(req, data, action) {
  req.session.inputData = {
    hasError: true,
    ...data,
  };
  req.session.save(action);
}

module.exports = {
  getSessionErrorData: getSessionErrorData,
  flashErrorToSession: flashErrorToSession,
};
