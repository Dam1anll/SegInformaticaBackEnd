module.exports = (app) => {
    const auth = require("../../middlewares/auth");
    const idea = require("../../controllers/idea.controller");
    const router = require("express").Router();

    // Ruta para cifrar texto
    router.post("/encrypt", idea.encryptText); 

    // Ruta para descifrar texto usando el ID del registro
    router.post("/decrypt/:id", idea.decryptText);

    // Uso del middleware de autenticación y rutas base
    app.use("/idea", auth, router);
};