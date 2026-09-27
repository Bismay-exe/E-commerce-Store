const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Authentication required." });
  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ message: "Invalid or expired access token." });
  }
};
