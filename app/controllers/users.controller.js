const db = require("../models");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await db.users.findOne({ where: { email: email } });

        if (user) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashPassword = await bcrypt.hash(String(password), 10);

        const newUser = await db.users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
        });

        res.status(201).json({ message: "Usuario registrado correctamente", data: newUser });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al crear el usuario"
        });
    }
};
exports.createTeacher = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await db.users.findOne({ where: { email: email } });

        if (user) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        const hashPassword = await bcrypt.hash(String(password), 10);

        const newUser = await db.users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
        });

        res.status(201).json({ message: "Usuario registrado correctamente", data: newUser });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al crear el usuario"
        });
    }
};
exports.getUsers = async (req, res) => {
    try {
        const userAttributes = ["id", "name", "email", "password", "role", "createdAt", "updatedAt"];
        const { correo } = req.query;
        const filtros = {};

        if (correo) {
            filtros.where = {
                ...filtros.where,
                email: {
                    [db.Sequelize.Op.iLike]: `%${correo}%`
                }
            };
        }
        const users = await db.users.findAll({ attributes: userAttributes, ...filtros });
        const responseData = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));

        res.status(200).json(responseData);
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al obtener los usuarios"
        });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    try {
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.name = name;
        user.email = email;
        user.role = role;
        await user.save();

        return res.status(200).json({
            message: "Usuario actualizado correctamente",
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Ocurrió un error al actualizar el usuario"
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    const { userId, newStatus } = req.body;

    try {
        const [updatedRows] = await db.users.update(
            { isActive: newStatus },
            { where: { id: userId } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: "No se encontró ningún usuario con ese ID." });
        }
        res.status(200).json({ message: "Usuario actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    }
};
