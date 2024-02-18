import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL,
    mongoDbName: process.env.MONGO_DB_NAME,
    environment: process.env.NODE_ENV,
    mailUser: process.env.GOOGLE_ACC,
    mailPass: process.env.GOOGLE_PW,
    baseUrl: process.env.BASE_URL
}