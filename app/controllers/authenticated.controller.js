const db = require("../models");
const bcrypt = require("bcrypt")

exports.updateProfile = async (req, res) => {
    try {
        // Elimina la contraseña para evitar que sea actualizada accidentalmente
        delete req.body.password;

        // Obtiene el ID del usuario autenticado
        const id = req.user.id;

        // Busca al usuario en la base de datos
        const user = await db[req.params.document].findByPk(id);

        if (!user) {
            return res.status(404).send({ message: "No user found." });
        }

        // Realiza la actualización de los datos del usuario
        const updateData = req.body;  // Aquí podrías agregar validaciones a los datos que se reciben

        const [updated] = await db[req.params.document].update(updateData, {
            where: { id: id },
        });

        if (updated) {
            res.send({ message: "Profile Updated." });
        } else {
            res.status(404).send({ message: `Cannot update with id=${id}` });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        // Verifica que tanto la contraseña antigua como la nueva sean proporcionadas
        if (!req.body.old_password || !req.body.password) {
            return res.status(400).send({ message: "Old & new password are required." });
        }

        // Verifica que la nueva contraseña no sea la misma que la antigua
        if (req.body.old_password === req.body.password) {
            return res.status(400).send({ message: "Old & new password should be different." });
        }

        const id = req.user.id;

        // Busca al usuario en la base de datos
        const user = await db[req.params.document].findByPk(id);

        if (!user) {
            return res.status(404).send({ message: "No user found." });
        }

        // Compara la contraseña antigua con la que está almacenada
        const match = await bcrypt.compare(req.body.old_password, user.password);

        if (!match) {
            return res.status(400).send({ message: "Incorrect old password." });
        }

        // Si las contraseñas coinciden, realiza el hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Actualiza la contraseña del usuario
        const [updated] = await db[req.params.document].update(
            { password: hashedPassword },
            { where: { id: id } }
        );

        if (updated) {
            res.send({ message: "Password updated successfully." });
        } else {
            res.status(404).send({ message: `Cannot update password for id=${id}` });
        }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};