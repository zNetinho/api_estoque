const NotFound = require("../error/not_found.js");

function handleNotFound(req, res, next) {
  if(req.errors) {
    const erro404 = new NotFound();
    next(erro404);
  }
}

module.exports = handleNotFound;