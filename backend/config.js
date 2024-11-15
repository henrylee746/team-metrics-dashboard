export const config = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  server: process.env.SQL_SERVER_URL,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
