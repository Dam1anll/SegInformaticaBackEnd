module.exports = app => {
    const auth = require("../../middlewares/auth");
    const encryption = require("../../controllers/encryption.controller");
    var router = require("express").Router();
  
    router.post("/encrypt", encryption.encryptText); 
    router.post("/decrypt", encryption.decryptText); 
  
    app.use("/encryption", auth, router);
  };
  