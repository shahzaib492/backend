const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY)
    if (!(decodedToken.role === "admin")) {
      return res.status(401).json({
        message: "Only Admin can access these routes"
      })
    }
    req.userData = {
      email: decodedToken.email,
      userid: decodedToken.userId,
      role: decodedToken.role
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: "You are not Authenticated!"
    })
  }
}
