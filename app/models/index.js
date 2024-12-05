require("dotenv").config({ path: '.env' });

const moment = require('moment-timezone');
const timezone = moment.tz.guess();

const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");

// Usamos DATABASE_URL para la conexión remota a la base de datos
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  timezone: timezone,
  // Configuración opcional si estás usando SSL (como en Heroku o Supabase)
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
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.tokens = require("./tokens.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);

// Asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sincronización de la base de datos y creación del usuario admin si no existe
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
