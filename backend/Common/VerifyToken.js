const jwt = require("jsonwebtoken");

require("dotenv").config();

function verifyToken(req, res, next, secretKey) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        statusCode: 401,
        message: "Authorization token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid or expired token",
    });
  }
}

function verifyTokenFarmer(req, res, next) {
  return verifyToken(req, res, next, process.env.PRIVATE_KEY_FARMERS);
}

function verifyTokenConsumer(req, res, next) {
  return verifyToken(req, res, next, process.env.PRIVATE_KEY_CONSUMERS);
}

module.exports = { verifyTokenFarmer, verifyTokenConsumer };
