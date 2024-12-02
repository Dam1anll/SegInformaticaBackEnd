module.exports = (sequelize, Sequelize) => {
    return sequelize.define("tokens", {
        token: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        phone: {
            type: Sequelize.STRING
        }
    });
};
