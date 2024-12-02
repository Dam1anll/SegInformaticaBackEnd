const db = require("../models");
const Text = db.texto;
const { encryptText, decryptText } = require("../helpers/encryption");

// Método para cifrar texto y guardarlo
exports.encryptText = async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: "El texto es obligatorio." });
    }

    try {
        // Cifrar texto
        const encrypted = encryptText(texto);

        // Guardar en la base de datos
        const newText = await Text.create({
            texto,
            encryptedText: encrypted,
        });

        return res.status(201).json({
            message: "Texto cifrado y guardado exitosamente.",
            data: newText,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error al cifrar el texto.",
            details: error.message,
        });
    }
};

// Método para descifrar texto y actualizar el modelo
exports.decryptText = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar texto por ID
        const textRecord = await Text.findByPk(id);

        if (!textRecord) {
            return res.status(404).json({ error: "Texto no encontrado." });
        }

        // Verificar si ya está descifrado
        if (textRecord.isDecrypted) {
            return res.status(200).json({
                message: "El texto ya estaba descifrado.",
                data: textRecord.decryptedText,
            });
        }

        // Descifrar texto
        const decrypted = decryptText(textRecord.encryptedText);

        // Actualizar registro
        textRecord.decryptedText = decrypted;
        textRecord.isDecrypted = true;
        await textRecord.save();

        return res.status(200).json({
            message: "Texto descifrado exitosamente.",
            data: textRecord,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error al descifrar el texto.",
            details: error.message,
        });
    }
};
