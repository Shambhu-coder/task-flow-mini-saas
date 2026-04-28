const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.USE_DATABASE_URL === 'true' && process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);

  sequelize = new Sequelize(
    url.pathname.slice(1),  // database name
    url.username,           // user
    url.password,           // password
    {
      host: url.hostname,
      port: url.port || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: false,
    }
  );
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

module.exports = sequelize;