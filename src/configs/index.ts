import dotenv from 'dotenv';

dotenv.config();

const { HOSTNAME, PORT, DB_URI, JWT_PRIVATE_KEY } = process.env;

const SERVER_HOSTNAME = HOSTNAME || 'localhost';
const SERVER_PORT = PORT || 3001;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

export default {
  server: SERVER,
  dbUri: DB_URI || 'mongodb://localhost:27017/monla',
  bcryptSaltRounds: 10,
  jwtPrivateKey: JWT_PRIVATE_KEY || 'monla123@',
};
