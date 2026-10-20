import mysql from 'mysql2/promise';

let pool;

export async function getConnection() {
  if (!pool) {
    const config = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    // Konfigurasi SSL Khusus untuk Aiven
    if (process.env.DB_CA_CERT) {
      config.ssl = {
        ca: Buffer.from(process.env.DB_CA_CERT, 'base64').toString('ascii'),
        rejectUnauthorized: true
      };
    }

    pool = mysql.createPool(config);
  }
  return pool;
}
