require("dotenv").config({ path: '.env' });

const moment = require('moment-timezone');
const timezone = moment.tz.guess();

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    timezone: timezone,
    /* dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }, */
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Este módelo es requerido, por favor de no eliminarlo.
db.tokens = require("./tokens.model.js")(sequelize, Sequelize);
//---------
db.texto = require("./texto.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

// Asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});

sequelize.sync().then(async () => {
  const anyPassword = "admin123";
  const hashPassword = await bcrypt.hash(String(anyPassword), 10);

  const adminUser = await db.users.findOne({ where: { id: 1 } });

  if (!adminUser) {
    await db.users.create({
      name: "ADMIN",
      email: "admin@admin.com",
      password: hashPassword,
      role: "ADMIN"
    });
  } else {
    console.log("Admin already exists");
  }
}).catch((error) => {
  console.log(error);
});

module.exports = db;
