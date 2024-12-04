module.exports = (sequelize, Sequelize) => {
    const Texto = sequelize.define("texto", {
        texto: {
            type: Sequelize.STRING, // Texto original
            allowNull: false,
        },
        encryptedText: {
            type: Sequelize.STRING, // Texto cifrado
            allowNull: false,
        },
        encryptionKey: {
            type: Sequelize.STRING, // Clave para descifrar
            allowNull: false,
        },
        decryptedText: {
            type: Sequelize.STRING, // Texto descifrado (opcional)
            allowNull: true,
        },
        isDecrypted: {
            type: Sequelize.BOOLEAN, // Indica si el texto ya fue descifrado
            defaultValue: false,
        },
    });

    return Texto;
};
