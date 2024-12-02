const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

exports.loginAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Correo electrónico y contraseña son requeridos" });
    }

    // Buscar usuario en la base de datos por correo electrónico
    const user = await db.users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Comparar la contraseña proporcionada
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Credenciales incorrectas" });
    }

    // Crear los tokens JWT
    const payload = { id: user.id, role: user.role };
    return res.send({
      access_token: jwt.accessTokenEncode(payload),
      refresh_token: jwt.refreshTokenEncode(payload),
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error en el servidor", error: error.message });
  }
};

exports.createAuth = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).send({ message: "Correo electrónico, contraseña y rol son requeridos" });
    }

    if (!["ADMIN", "USER"].includes(role)) {
      return res.status(400).send({ message: "El rol debe ser ADMIN o USER" });
    }

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await db.users.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send({ message: "El correo electrónico ya está en uso" });
    }

    // Crear el usuario con la contraseña cifrada
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.users.create({
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    // Generar tokens JWT
    const payload = { id: newUser.id, role: newUser.role };
    return res.send({
      access_token: jwt.accessTokenEncode(payload),
      refresh_token: jwt.refreshTokenEncode(payload),
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error en el servidor", error: error.message });
  }
};

exports.accessToken = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).send({ message: "Access Token es requerido" });
    }

    const decoded = jwt.accessTokenDecode(access_token);
    if (!decoded) {
      return res.status(401).send({ message: "Token inválido" });
    }

    const user = await db.users.findByPk(decoded.id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    return res.send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error en el servidor", error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).send({ message: "Refresh Token es requerido" });
    }

    const decoded = jwt.refreshTokenDecode(refresh_token);
    if (!decoded) {
      return res.status(401).send({ message: "Token inválido" });
    }

    const payload = { id: decoded.id, role: decoded.role };
    return res.send({
      access_token: jwt.accessTokenEncode(payload),
      refresh_token: jwt.refreshTokenEncode(payload),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error en el servidor", error: error.message });
  }
};
