import * as dotenv from 'dotenv';

dotenv.config();

export const configs = {
  SERVER_PORT: process.env.SERVER_PORT || 3000,

  JWT_SECRET: process.env.JWT_SECRET || 'test',

  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh',

  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',

  DATABASE_PORT: process.env.DATABASE_PORT || 5432,

  DATABASE_USER: process.env.DATABASE_USER || 'root',

  DATABASE_PASS: process.env.DATABASE_PASS,

  DATABASE_NAME: process.env.DATABASE_NAME,

  DATABASE_TYPE: process.env.DATABASE_TYPE || 'mysql',
};
