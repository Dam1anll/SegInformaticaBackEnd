const crypto = require("crypto");

const algorithm = "aes-256-cbc";

exports.encryptText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).send({ message: "El texto a encriptar es requerido" });
    }

    const key = crypto.randomBytes(32); 
    const iv = crypto.randomBytes(16); 

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return res.send({
      message: "Texto encriptado exitosamente",
      encryptedText: encrypted,
      key: key.toString("hex"),
      iv: iv.toString("hex"),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error al encriptar", error: error.message });
  }
};

exports.decryptText = async (req, res) => {
  try {
    const { encryptedText, key, iv } = req.body;

    if (!encryptedText || !key || !iv) {
      return res
        .status(400)
        .send({ message: "Texto encriptado, clave y vector de inicialización (IV) son requeridos" });
    }

    const keyBuffer = Buffer.from(key, "hex");
    const ivBuffer = Buffer.from(iv, "hex");

    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return res.send({
      message: "Texto desencriptado exitosamente",
      decryptedText: decrypted,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Ocurrió un error al desencriptar", error: error.message });
  }
};
