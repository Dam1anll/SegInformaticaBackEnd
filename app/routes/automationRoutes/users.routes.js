module.exports = (app) => {
    const auth = require("../../middlewares/auth");
    const users = require("../../controllers/users.controller");

    var router = require("express").Router();

    // Rutas de usuarios
    router.post("/", users.createUser); // Crear un nuevo usuario
    router.get("/", users.getUsers); // Obtener todos los usuarios
    router.put("/updateState", users.updateUserStatus);
    
    app.use("/users", auth, router);
};
