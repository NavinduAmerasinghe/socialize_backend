const jwt = require("jsonwebtoken");
const UserDB = require("../Schemas/user");

module.exports = (request, response, next) => {
  console.log("Inside the authentication token middleware");
  const authHeader = request.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not  authenticated ");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "MyDifficultSecret");
    request.email = decodedToken.email;
    next();
  } catch (err) {
    err.statuscode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
};
