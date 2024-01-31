const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    console.log(req.headers["Authorization"]);
    const token = req.headers.authorization;
    console.log({token});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decoded.userId;
        // console.log("hello" + req.body.userId)
        next();
      }
    });

  } catch (error) {
    console.log(error)
    // console.log(error)
    return res.status(401).send({
      message: "Auth failed before executing",
      success: false,
    });
  }
};
