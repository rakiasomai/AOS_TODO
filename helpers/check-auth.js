const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  // context = { ... headers }
  const authoH = context.req.headers.authorization;
  if (authoH) {
    // Bearer ....
    const tkn = authoH.split("Bearer ")[1];
    if (tkn) {
      try {
        const user = jwt.verify(tkn, SECRET_KEY);
        return user;
      } catch (err) {
        // token test
        throw new AuthenticationError("Token incorrect or expired");
      }
    }
    // Autorisation test
    throw new Error("Authentication token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
