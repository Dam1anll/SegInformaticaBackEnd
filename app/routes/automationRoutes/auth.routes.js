module.exports = app => {
  const auth = require("../../controllers/auth.controller");

  var router = require("express").Router();

  router.post("/register", auth.registerAuth); // Register
  router.post("/:document", auth.loginAuth); // Login
  router.post("/access-token/:document", auth.accessToken); // Access Token
  router.post("/refresh-token/:document", auth.refreshToken); // Refresh Token

  // Without Authentication
  app.use("/auth", router);
};
