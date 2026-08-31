function validateParams(params) {
  for (let i = 0; i < params.length; i++) {
    if (!params[i] && params[i] != 0) {
      return false;
    }
  }
  return true;
}

module.exports = { validateParams };
